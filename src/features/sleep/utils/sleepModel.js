export const createSleepEntry = (date, hours, minutes) => {
    return {
        id: Date.now().toString(),
        date,
        hours,
        minutes
    }
};

const SLEEP_TARGET_MINS = 8 * 60 + 15;
const SLEEP_RANGE_MINS  = 45;

export const calcSleepPoints = (hours, minutes) => {
    const total = hours * 60 + minutes;
    const dist  = Math.abs(total - SLEEP_TARGET_MINS);
    if (dist > SLEEP_RANGE_MINS) return 0;
    return Math.round(3 + 7 * (1 - dist / SLEEP_RANGE_MINS));
};