export const createSleepEntry = (date, hours, minutes) => {
    return {
        id: Date.now().toString(),
        date,
        hours,
        minutes
    }
}