import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
};

const BASE_POINTS = { daily: 10, weekly: 25, monthly: 50, sleep: 5, spend: 15 };
const MISS_PENALTY = { daily: 5, weekly: 15, monthly: 30 };

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
            if (stored) setData(JSON.parse(stored));
        });
    }, []);

    const update = (fn) => {
        setData(current => {
            const newData = fn(current);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            return newData;
        });
    };

    // Call when all goals in a section are completed
    const earnSection = (type) => {
        update(current => {
            const streak = current.streaks[type];
            const today = todayStr();

            // Don't award twice in the same period
            if (streak.lastFullCompletion === today) return current;

            let isConsecutive = false;
            if (type === 'daily')   isConsecutive = streak.lastFullCompletion === yesterdayStr();
            if (type === 'weekly')  isConsecutive = streak.lastFullCompletion === getLastWeekMonday();
            if (type === 'monthly') isConsecutive = streak.lastFullCompletion && streak.lastFullCompletion.slice(0, 7) === getPreviousMonth();

            const newCount = isConsecutive ? streak.count + 1 : 1;
            const expiry = addDays(today, 2);

            const updatedStreaks = {
                ...current.streaks,
                [type]: { count: newCount, lastFullCompletion: today, expiry },
            };

            const multiplier = calcMultiplier(updatedStreaks);
            const earned = Math.floor(BASE_POINTS[type] * multiplier);

            return {
                ...current,
                balance: current.balance + earned,
                streaks: updatedStreaks,
                consecutiveMisses: { ...current.consecutiveMisses, [type]: 0 },
            };
        });
    };

    // Call when a sleep entry is logged
    const earnSleep = () => {
        update(current => ({
            ...current,
            balance: current.balance + BASE_POINTS.sleep,
        }));
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
                    balance += BASE_POINTS.spend;
                    changed = true;
                }
            }

            if (!changed) return current;

            // Recompute spend streak: consecutive days from yesterday back
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

    // Call from HabitsScreen on mount — checks previous periods for missed goals
    const checkPenalties = (goals) => {
        update(current => {
            const today = todayStr();
            if (current.lastPenaltyCheck === today) return current;

            // First ever open — just record date, no penalty
            if (!current.lastPenaltyCheck) {
                return { ...current, lastPenaltyCheck: today };
            }

            let balance = current.balance;
            let consecutiveMisses = { ...current.consecutiveMisses };
            let lockoutUntil = current.lockoutUntil;
            const streaks = { ...current.streaks };

            const applyMiss = (type) => {
                balance = Math.max(0, balance - MISS_PENALTY[type]);
                consecutiveMisses[type]++;
                streaks[type] = { ...streaks[type], count: 0, expiry: null };
                if (consecutiveMisses[type] >= 3) {
                    const lockout = new Date();
                    lockout.setDate(lockout.getDate() + 1);
                    lockoutUntil = lockout.toISOString();
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
        earnSection,
        earnSleep,
        checkSpendAwards,
        spendPoints,
        checkPenalties,
    };
};

export default usePoints;
