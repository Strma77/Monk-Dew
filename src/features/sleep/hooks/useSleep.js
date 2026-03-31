import { useState, useEffect } from "react";
import { createSleepEntry } from "../utils/sleepModel"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default useSleep = () => {
    const [sleep_entries, setSleep] = useState([]);

        const loadData = async () => {
        const stored = await AsyncStorage.getItem('sleep_entries');

        if (stored) {
            setSleep(JSON.parse(stored));
        } else {
            setSleep([]);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveToStorage = async (sleep) => {
        await AsyncStorage.setItem('sleep_entries', JSON.stringify(sleep));
    };
    const addSleep = (date, hours, minutes) => {
        const newSleep = createSleepEntry(date, hours, minutes);
        const exists = sleep_entries.some(e => e.date === date);
        const updatedSleep = exists
            ? sleep_entries.map(e => e.date === date ? { ...newSleep, id: e.id } : e)
            : [...sleep_entries, newSleep];
        setSleep(updatedSleep);
        saveToStorage(updatedSleep);
    };
    const deleteSleep = (id) => {
        const deletedSleep = sleep_entries.filter(t => t.id !== id);
        setSleep(deletedSleep);
        saveToStorage(deletedSleep);
    };
    const updateSleep = (updatedEntry) => {
        const updatedSleep = sleep_entries.map(t => t.id === updatedEntry.id ? updatedEntry : t);
        setSleep(updatedSleep);
        saveToStorage(updatedSleep)
    }

    const clearSleep = async () => {
        setSleep([]);
        await AsyncStorage.removeItem('sleep_entries');
    };

    return { sleep_entries, saveToStorage, addSleep, deleteSleep, updateSleep, clearSleep };
}