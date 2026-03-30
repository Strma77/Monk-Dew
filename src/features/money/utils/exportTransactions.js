export const formatMonthExport = (transactions, year, month) => {
    const monthTransactions = transactions.filter((t) => {
        return t.date.startsWith(`${year}-${String(month).padStart(2,'0')}`);
    })

    const grouped = {};

    for (const t of monthTransactions) {
        if(grouped[t.date]) grouped[t.date].push(t);
        else grouped[t.date] = [t];
    }

    const sortedDates = Object.keys(grouped).sort();
    let output = '';

    for (const date of sortedDates) {
        const [y, m, d] = date.split('-');
        output += `${parseInt(d)}.${parseInt(m)}.${y}.\n`;

        let sum = 0;
        for(const t of grouped[date]){
            output += `${t.amount}€ - ${t.category}\n`;
            if(t.type === 'expense') sum += t.amount;
            else sum -= t.amount;
        }

        if(sum > 0) output += `= ${sum}€ \n`
        else if (sum < 0) output += `= +${Math.abs(sum)}€ \n`
        else output += `= 0€ \n`
    }

    return output;
}