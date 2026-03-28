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
    }
    const addTransaction = ({date, amount, type, category, note}) => {
        const newTransaction = createTransaction(date, amount, type, category, note);
        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        saveToStorage(updatedTransactions);
    }
    const deleteTransaction = (transaction) => {
        const updatedTransactions = transactions.filter(t => t.id !== transaction.id);
        setTransactions(updatedTransactions);
        saveToStorage(updatedTransactions);
    }

    return { transactions, addTransaction, deleteTransaction };
}