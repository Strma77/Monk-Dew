export const getCalendarDays = (year, month) => {
    const rawStart = new Date(year, month, 1).getDay();
    const startDay = (rawStart + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return days;
};