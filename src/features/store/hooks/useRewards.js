import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRewardConfig, PURCHASE_COOLDOWN_MS } from '../utils/rewardsConfig';

const STORAGE_KEY = 'rewards';

const DEFAULT_DATA = {
    lastPurchaseTime: null,
    active: [],
};

const useRewards = () => {
    const [data, setData] = useState(DEFAULT_DATA);
    const [rewardsLoaded, setRewardsLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then(stored => {
            if (stored) {
                const parsed = JSON.parse(stored);
                const now = Date.now();
                // Clean out expired time-based rewards on load
                const active = parsed.active.filter(r => r.expiresAt === null || r.expiresAt > now);
                setData({ ...parsed, active });
            }
            setRewardsLoaded(true);
        });
    }, []);

    const save = (updated) => {
        setData(updated);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const canPurchaseNow = () => {
        if (!data.lastPurchaseTime) return true;
        return Date.now() - data.lastPurchaseTime >= PURCHASE_COOLDOWN_MS;
    };

    const cooldownHoursLeft = () => {
        if (!data.lastPurchaseTime) return 0;
        const remaining = PURCHASE_COOLDOWN_MS - (Date.now() - data.lastPurchaseTime);
        if (remaining <= 0) return 0;
        return Math.ceil(remaining / (60 * 60 * 1000));
    };

    const purchaseReward = (type, extra = {}) => {
        const config = getRewardConfig(type);
        if (!config) return;
        const now = Date.now();
        const entry = {
            type,
            purchasedAt: now,
            expiresAt: config.duration ? now + config.duration : null,
            ...extra,
        };
        save({
            lastPurchaseTime: now,
            active: [...data.active, entry],
        });
    };

    const consumeReward = (type) => {
        save({
            ...data,
            active: data.active.filter(r => r.type !== type),
        });
    };

    const isActive = (type) => {
        const now = Date.now();
        return data.active.some(r => r.type === type && (r.expiresAt === null || r.expiresAt > now));
    };

    const getActive = (type) => {
        const now = Date.now();
        return data.active.find(r => r.type === type && (r.expiresAt === null || r.expiresAt > now)) || null;
    };

    return {
        rewardsLoaded,
        activeRewards: data.active,
        canPurchaseNow,
        cooldownHoursLeft,
        purchaseReward,
        consumeReward,
        isActive,
        getActive,
    };
};

export default useRewards;
