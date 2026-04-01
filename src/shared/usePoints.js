import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyStreakMilestone, notifyBalanceThreshold, notifyLockoutWarning } from './notifications';

const STORAGE_KEY = 'points';

const DEFAULT_DATA = {
    balance: 0,
    streaks: {
        daily:   { count: 0, lastFullCompletion: null, expiry: null },
        weekly:  { count: 0, lastFullCompletion: null, expiry: null },
        monthly: { count: 0, lastFullCompletion: null, expiry: null },
        spend:   { count: 0, expiry: null },
    },
    lockoutUntil: null,
    consecutiveMisses: { daily: 0, weekly: 0, monthly: 0 },
    lastPenaltyCheck: null,
    awardedSpendDays: [],
    pointBoostUntil: null,
    focusSection: null,
    focusUntil: null,
    notifiedThresholds: [],
};

// Reward costs in order — used for balance threshold notifications
const REWARD_THRESHOLDS = [
    { cost: 60,  name: 'Iron Will' },
    { cost: 75,  name: 'Point Boost' },
    { cost: 100, name: 'Video Game Session' },
    { cost: 120, name: 'Streak Shield' },
    { cost: 130, name: 'Cheat Day' },
    { cost: 150, name: 'Focus' },
    { cost: 200, name: 'Multiplier Freeze' },
    { cost: 220, name: 'Penalty Erase' },
    { cost: 280, name: 'Last Stand' },
];

const checkAndNotifyThresholds = (oldBalance, newBalance, notifiedThresholds) => {
    const updated = [...notifiedThresholds];
    for (const { cost, name } of REWARD_THRESHOLDS) {
        if (newBalance >= cost && oldBalance < cost && !updated.includes(cost)) {
            updated.push(cost);
            notifyBalanceThreshold(name, cost);
        }
    }
    return updated;
};

const BASE_POINTS = { daily: 10, weekly: 25, monthly: 50, spend: 15 };
const MISS_PENALTY = { daily: 5, weekly: 15, monthly: 30 };

// Sleep curve: bell curve centered at 8h15m, range 7h30m–9h00m, 3–10 pts
const SLEEP_TARGET_MINS = 8 * 60 + 15;
const SLEEP_RANGE_MINS  = 45;

const calcSleepPoints = (hours, minutes) => {
    const total = hours * 60 + minutes;
    const dist  = Math.abs(total - SLEEP_TARGET_MINS);
    if (dist > SLEEP_RANGE_MINS) return 0;
    return Math.round(3 + 7 * (1 - dist / SLEEP_RANGE_MINS));
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const yesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
};

const addDays = (dateStr, n) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
};

const getMondayOf = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    d.setDate(d.getDate() - (day + 6) % 7);
    return d.toISOString().slice(0, 10);
};

const getLastWeekMonday = () => {
    const d = new Date();
    const day = d.getDay();
    d.setDate(d.getDate() - (day + 6) % 7 - 7);
    return d.toISOString().slice(0, 10);
};

const getPreviousMonth = () => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
};

const getStreakBonus = (streak, type) => {
    if (!streak.expiry || todayStr() > streak.expiry) return 0;
    const rates = { daily: 0.1, weekly: 0.25, monthly: 0.5, spend: 0.1 };
    const caps  = { daily: 1.0, weekly: 1.0,  monthly: 2.0, spend: 1.0 };
    return Math.min(streak.count * rates[type], caps[type]);
};

const calcMultiplier = (streaks) =>
    1
    + getStreakBonus(streaks.daily,   'daily')
    + getStreakBonus(streaks.weekly,  'weekly')
    + getStreakBonus(streaks.monthly, 'monthly')
    + getStreakBonus(streaks.spend,   'spend');

const usePoints = () => {
    const [data, setData] = useState(DEFAULT_DATA);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(stored => {
            if (stored) setData({ ...DEFAULT_DATA, ...JSON.parse(stored) });
        });
    }, []);

    const update = (fn) => {
        setData(current => {
            const newData = fn(current);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            return newData;
        });
    };

    const isBoostActive = (current) =>
        current.pointBoostUntil != null && Date.now() < current.pointBoostUntil;

    const isFocusActive = (current, type) =>
        current.focusSection === type &&
        current.focusUntil != null &&
        Date.now() < current.focusUntil;

    // Call when all goals in a section are completed
    const earnSection = (type) => {
        update(current => {
            const streak = current.streaks[type];
            const today = todayStr();

            if (streak.lastFullCompletion === today) return current;

            let isConsecutive = false;
            if (type === 'daily')   isConsecutive = streak.lastFullCompletion === yesterdayStr();
            if (type === 'weekly')  isConsecutive = streak.lastFullCompletion === getLastWeekMonday();
            if (type === 'monthly') isConsecutive = streak.lastFullCompletion && streak.lastFullCompletion.slice(0, 7) === getPreviousMonth();

            const newCount = isConsecutive ? streak.count + 1 : 1;
            const expiry = addDays(today, 2);

            if ([7, 14, 30].includes(newCount)) notifyStreakMilestone(type, newCount);

            const updatedStreaks = {
                ...current.streaks,
                [type]: { count: newCount, lastFullCompletion: today, expiry },
            };

            const multiplier = calcMultiplier(updatedStreaks);
            let earned = Math.floor(BASE_POINTS[type] * multiplier);

            if (isFocusActive(current, type)) earned *= 2;
            if (isBoostActive(current)) earned *= 2;

            const newBalance = current.balance + earned;
            const notifiedThresholds = checkAndNotifyThresholds(
                current.balance, newBalance, current.notifiedThresholds || []
            );

            return {
                ...current,
                balance: newBalance,
                streaks: updatedStreaks,
                consecutiveMisses: { ...current.consecutiveMisses, [type]: 0 },
                notifiedThresholds,
            };
        });
    };

    // Call when a sleep entry is logged — uses bell curve, not flat points
    const earnSleep = (hours, minutes) => {
        update(current => {
            let pts = calcSleepPoints(hours, minutes);
            if (pts <= 0) return current;
            if (isBoostActive(current)) pts *= 2;
            const newBalance = current.balance + pts;
            const notifiedThresholds = checkAndNotifyThresholds(
                current.balance, newBalance, current.notifiedThresholds || []
            );
            return { ...current, balance: newBalance, notifiedThresholds };
        });
    };

    // Call from MoneyScreen when transactions change — scans past 30 days for 0-spend
    const checkSpendAwards = (transactions) => {
        update(current => {
            const awarded = new Set(current.awardedSpendDays);
            let balance = current.balance;
            let changed = false;

            for (let i = 1; i <= 30; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().slice(0, 10);

                if (awarded.has(dateStr)) continue;

                const hasExpense = transactions.some(t => t.date === dateStr && t.type === 'expense');
                if (!hasExpense) {
                    awarded.add(dateStr);
                    let pts = BASE_POINTS.spend;
                    if (isBoostActive(current)) pts *= 2;
                    balance += pts;
                    changed = true;
                }
            }

            if (!changed) return current;

            const notifiedThresholds = checkAndNotifyThresholds(
                current.balance, balance, current.notifiedThresholds || []
            );

            let spendCount = 0;
            for (let i = 1; ; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().slice(0, 10);
                if (awarded.has(dateStr)) spendCount++;
                else break;
            }

            const sortedAwarded = Array.from(awarded).sort();
            const latestAwarded = sortedAwarded[sortedAwarded.length - 1];
            const spendExpiry = latestAwarded ? addDays(latestAwarded, 2) : null;

            return {
                ...current,
                balance,
                streaks: {
                    ...current.streaks,
                    spend: { count: spendCount, expiry: spendExpiry },
                },
                awardedSpendDays: Array.from(awarded),
                notifiedThresholds,
            };
        });
    };

    // Deducts points — check balance >= amount before calling
    const spendPoints = (amount) => {
        update(current => ({
            ...current,
            balance: Math.max(0, current.balance - amount),
        }));
    };

    // Activate Point Boost — called from StoreScreen on purchase
    const activatePointBoost = () => {
        update(current => ({
            ...current,
            pointBoostUntil: Date.now() + 24 * 60 * 60 * 1000,
        }));
    };

    // Activate Focus — called from StoreScreen on purchase
    const activateFocus = (section) => {
        update(current => ({
            ...current,
            focusSection: section,
            focusUntil: Date.now() + 7 * 24 * 60 * 60 * 1000,
        }));
    };

    // Call from HabitsScreen on mount — checks previous periods for missed goals
    // activeRewards and consumeReward come from useRewards (HabitsScreen has both)
    const checkPenalties = (goals, activeRewards, consumeReward) => {
        update(current => {
            const today = todayStr();
            if (current.lastPenaltyCheck === today) return current;
            if (!current.lastPenaltyCheck) return { ...current, lastPenaltyCheck: today };

            let balance = current.balance;
            let consecutiveMisses = { ...current.consecutiveMisses };
            let lockoutUntil = current.lockoutUntil;
            const streaks = { ...current.streaks };
            const now = Date.now();

            const rewardActive = (type) =>
                activeRewards && activeRewards.some(
                    r => r.type === type && (r.expiresAt === null || r.expiresAt > now)
                );

            // Multiplier Freeze: extend streak expiries so they don't decay today
            if (rewardActive('multiplierFreeze')) {
                const ext = addDays(today, 2);
                for (const key of ['daily', 'weekly', 'monthly', 'spend']) {
                    if (streaks[key].count > 0) {
                        streaks[key] = { ...streaks[key], expiry: ext };
                    }
                }
            }

            // Cheat Day: skip ALL penalty checks, consume the reward
            if (rewardActive('cheatDay')) {
                if (consumeReward) consumeReward('cheatDay');
                return { ...current, streaks, lastPenaltyCheck: today };
            }

            const hasIronWill     = rewardActive('ironWill');
            const hasPenaltyErase = rewardActive('penaltyErase');
            const hasStreakShield = rewardActive('streakShield');
            const hasLastStand    = rewardActive('lastStand');

            let penaltyEraseUsed  = false;
            let streakShieldUsed  = false;

            const applyMiss = (type) => {
                // Penalty Erase: block this one penalty
                if (hasPenaltyErase && !penaltyEraseUsed) {
                    penaltyEraseUsed = true;
                    if (consumeReward) consumeReward('penaltyErase');
                    consecutiveMisses[type]++;
                    return;
                }

                let penalty = MISS_PENALTY[type];
                if (hasIronWill) penalty = Math.ceil(penalty / 2);
                balance = Math.max(0, balance - penalty);
                consecutiveMisses[type]++;
                if (consecutiveMisses[type] === 2) notifyLockoutWarning();

                // Streak Shield: protect streak from reset (one streak, one use)
                if (hasStreakShield && !streakShieldUsed) {
                    streakShieldUsed = true;
                    if (consumeReward) consumeReward('streakShield');
                } else {
                    streaks[type] = { ...streaks[type], count: 0, expiry: null };
                }

                if (consecutiveMisses[type] >= 3) {
                    // Last Stand: block the lockout
                    if (hasLastStand) {
                        if (consumeReward) consumeReward('lastStand');
                        consecutiveMisses[type] = 2;
                    } else {
                        const lockout = new Date();
                        lockout.setDate(lockout.getDate() + 1);
                        lockoutUntil = lockout.toISOString();
                    }
                }
            };

            // Daily — check yesterday
            const dailyGoals = goals.filter(g => g.type === 'daily');
            if (dailyGoals.length > 0) {
                const yest = yesterdayStr();
                const allDone = dailyGoals.every(g => g.completedOn === yest);
                if (allDone) consecutiveMisses.daily = 0;
                else applyMiss('daily');
            }

            // Weekly — only check on Monday
            const weeklyGoals = goals.filter(g => g.type === 'weekly');
            if (weeklyGoals.length > 0 && new Date().getDay() === 1) {
                const lastMonday = getLastWeekMonday();
                const allDone = weeklyGoals.every(g => g.completedOn && getMondayOf(g.completedOn) === lastMonday);
                if (allDone) consecutiveMisses.weekly = 0;
                else applyMiss('weekly');
            }

            // Monthly — only check on the 1st
            const monthlyGoals = goals.filter(g => g.type === 'monthly');
            if (monthlyGoals.length > 0 && new Date().getDate() === 1) {
                const prevMonth = getPreviousMonth();
                const allDone = monthlyGoals.every(g => g.completedOn && g.completedOn.slice(0, 7) === prevMonth);
                if (allDone) consecutiveMisses.monthly = 0;
                else applyMiss('monthly');
            }

            return {
                ...current,
                balance,
                consecutiveMisses,
                lockoutUntil,
                streaks,
                lastPenaltyCheck: today,
            };
        });
    };

    const isLockedOut = data.lockoutUntil != null && new Date().toISOString() < data.lockoutUntil;

    return {
        balance: data.balance,
        multiplier: calcMultiplier(data.streaks),
        isLockedOut,
        lockoutUntil: data.lockoutUntil,
        isPointBoostActive: isBoostActive(data),
        activeFocusSection: data.focusSection && data.focusUntil && Date.now() < data.focusUntil ? data.focusSection : null,
        earnSection,
        earnSleep,
        checkSpendAwards,
        spendPoints,
        activatePointBoost,
        activateFocus,
        checkPenalties,
    };
};

export default usePoints;
