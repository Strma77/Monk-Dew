// Transaction shape:
// {
//   id: string,
//   date: string (YYYY-MM-DD),
//   amount: number (always positive),
//   type: 'expense' | 'income',
//   category: string,
//   note: string
// }

export const createTransaction = (date, amount, type, category, note) => {
    return {
        id: Date.now().toString(),
        date,
        amount,
        type,
        category,
        note
    }
};