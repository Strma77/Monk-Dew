import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createGoal, isCompletedThisPeriod } from "../utils/habitsModel";

const useHabits = () => {
    const [goals, setGoals] = useState([]);

    const loadData = async () => {
        const stored = await AsyncStorage.getItem('habits');
        if (stored) {
            setGoals(JSON.parse(stored));
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveToStorage = async (updated) => {
        await AsyncStorage.setItem('habits', JSON.stringify(updated));
    };

    const addGoal = (text, type) => {
        const newGoal = createGoal(text, type);
        const updated = [...goals, newGoal];
        setGoals(updated);
        saveToStorage(updated);
    };

    const toggleGoal = (id) => {
        const today = new Date().toISOString().slice(0, 10);
        const updated = goals.map(g => {
            if (g.id !== id) return g;
            return {
                ...g,
                completedOn: isCompletedThisPeriod(g) ? null : today,
            };
        });
        setGoals(updated);
        saveToStorage(updated);
    };

    const deleteGoal = (id) => {
        const updated = goals.filter(g => g.id !== id);
        setGoals(updated);
        saveToStorage(updated);
    };

    return { goals, addGoal, toggleGoal, deleteGoal };
};

export default useHabits;
