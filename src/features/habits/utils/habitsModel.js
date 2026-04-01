export const createGoal = (text, type, isTemplate = false) => {
    return {
        id: Date.now().toString(),
        text,
        type,
        completedOn: null,
        isTemplate,
    }
};

const getMondayOf = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    const daysFromMonday = (day + 6) % 7;
    date.setDate(date.getDate() - daysFromMonday);
    return date.toISOString().slice(0, 10);
};

export const isCompletedThisPeriod = (goal) => {
    if (!goal.completedOn) return false;

    const today = new Date().toISOString().slice(0, 10);

    if (goal.type === 'daily') {
        return goal.completedOn === today;
    } else if (goal.type === 'monthly') {
        return goal.completedOn.slice(0, 7) === today.slice(0, 7);
    } else {
        return getMondayOf(goal.completedOn) === getMondayOf(today);
    }
};