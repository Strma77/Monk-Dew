export const getTotalSpent = (transactions, month, year) => {
    const expenses = transactions.filter(t => t.type === "expense" && parseInt(t.date.split("-")[1]) === month && parseInt(t.date.split("-")[0]) === year);
    const total = expenses.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    return total;
};

export const getDailyTotals = (transactions) => {
    const expenses = transactions.filter(t => t.type === "expense");
    const obj = {};
    for (const t of expenses){
        if(obj[t.date]) obj[t.date] += t.amount;
        else obj[t.date] = t.amount;
    }
    return obj;
};