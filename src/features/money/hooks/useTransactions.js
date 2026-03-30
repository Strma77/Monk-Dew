import { useState, useEffect } from "react";
import { createTransaction } from "../utils/transactionModel";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);

    const loadData = async () => {
        const stored = await AsyncStorage.getItem('transactions');

        if (stored) {
            setTransactions(JSON.parse(stored));
        } else {
            setTransactions([]);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    const saveToStorage = async (transactions) => {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    };
    const addTransaction = ({date, amount, type, category, note}) => {
        const newTransaction = createTransaction(date, amount, type, category, note);
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        saveToStorage(updatedTransactions);
    };
    const deleteTransaction = (transaction) => {
        const deletedTransactions = transactions.filter(t => t.id !== transaction.id);
        setTransactions(deletedTransactions);
        saveToStorage(deletedTransactions);
    };
    const updateTransaction = (transaction) => {
        const updatedTransaction = transactions.map(t => t.id === transaction.id ? transaction : t);
        setTransactions(updatedTransaction);
        saveToStorage(updatedTransaction)
    }
    const importTransactions = (incoming) => {
        const existingIds = new Set(transactions.map(t => t.id));
        const newOnes = incoming.filter(t => !existingIds.has(t.id));
        const merged = [...transactions, ...newOnes];
        setTransactions(merged);
        saveToStorage(merged);
    }

    return { transactions, addTransaction, deleteTransaction, updateTransaction, importTransactions};
}