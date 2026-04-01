const DAY_MS = 24 * 60 * 60 * 1000;

export const REWARDS = [
    {
        type: 'ironWill',
        name: 'Iron Will',
        cost: 60,
        description: 'Miss penalties are halved for 24 hours.',
        duration: DAY_MS,
    },
    {
        type: 'pointBoost',
        name: 'Point Boost',
        cost: 75,
        description: 'All points earned are doubled for 24 hours.',
        duration: DAY_MS,
    },
    {
        type: 'videoGame',
        name: 'Video Game Session',
        cost: 100,
        description: 'Guilt-free gaming for 24 hours. You earned it.',
        duration: DAY_MS,
    },
    {
        type: 'streakShield',
        name: 'Streak Shield',
        cost: 120,
        description: 'Auto-protects one streak from breaking when you miss. Single use.',
        duration: null,
    },
    {
        type: 'cheatDay',
        name: 'Cheat Day',
        cost: 130,
        description: 'Skips all habit penalties for one penalty check. You still open the app.',
        duration: DAY_MS,
    },
    {
        type: 'focus',
        name: 'Focus',
        cost: 150,
        description: 'One habit section gives 2x points for 7 days. Pick on purchase.',
        duration: 7 * DAY_MS,
    },
    {
        type: 'multiplierFreeze',
        name: 'Multiplier Freeze',
        cost: 200,
        description: 'Pauses your streak multiplier from decaying for 3 days.',
        duration: 3 * DAY_MS,
    },
    {
        type: 'penaltyErase',
        name: 'Penalty Erase',
        cost: 220,
        description: 'Blocks the next penalty that would fire. Single use.',
        duration: null,
    },
    {
        type: 'lastStand',
        name: 'Last Stand',
        cost: 280,
        description: 'Auto-blocks one store lockout before it triggers. Requires foresight.',
        duration: null,
    },
];

export const getRewardConfig = (type) => REWARDS.find(r => r.type === type);

export const PURCHASE_COOLDOWN_MS = 2 * DAY_MS;
