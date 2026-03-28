export const getTotalSpent = (transactions) => {
    const expenses = transactions.filter(t => t.type === "expense");
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);

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