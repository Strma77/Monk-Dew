import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createGoal, isCompletedThisPeriod } from "../utils/habitsModel";

const currentMonthStr = () => new Date().toISOString().slice(0, 7); // YYYY-MM

const useHabits = () => {
    const [goals, setGoals] = useState([]);
    const [showTemplateSetup, setShowTemplateSetup] = useState(false);

    const loadData = async () => {
        const stored = await AsyncStorage.getItem('habits');
        const parsed = stored ? JSON.parse(stored) : [];
        setGoals(parsed);

        const lastMonth = await AsyncStorage.getItem('habitTemplateMonth');
        const hasTemplateGoals = parsed.some(g => g.isTemplate);
        if (lastMonth !== currentMonthStr() && !hasTemplateGoals) {
            setShowTemplateSetup(true);
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

    const toggleGoal = (id, onSectionComplete) => {
        const today = new Date().toISOString().slice(0, 10);
        const goal = goals.find(g => g.id === id);
        const wasCompleted = isCompletedThisPeriod(goal);

        const updated = goals.map(g => {
            if (g.id !== id) return g;
            return { ...g, completedOn: wasCompleted ? null : today };
        });

        if (!wasCompleted && onSectionComplete) {
            const sectionDone = updated
                .filter(g => g.type === goal.type)
                .every(g => isCompletedThisPeriod(g));
            if (sectionDone) onSectionComplete(goal.type);
        }

        setGoals(updated);
        saveToStorage(updated);
    };

    const deleteGoal = (id) => {
        const updated = goals.filter(g => g.id !== id);
        setGoals(updated);
        saveToStorage(updated);
    };

    // Called when user confirms template setup modal
    const completeTemplateSetup = async (templateTexts) => {
        // Remove old template goals, keep user-added ones
        const nonTemplate = goals.filter(g => !g.isTemplate);
        const newTemplates = templateTexts.map((text, i) =>
            ({ ...createGoal(text, 'daily', true), id: (Date.now() + i).toString() })
        );
        const updated = [...nonTemplate, ...newTemplates];
        setGoals(updated);
        await saveToStorage(updated);
        await AsyncStorage.setItem('habitTemplateMonth', currentMonthStr());
        setShowTemplateSetup(false);
    };

    const skipTemplateSetup = () => {
        setShowTemplateSetup(false);
    };

    return { goals, addGoal, toggleGoal, deleteGoal, showTemplateSetup, completeTemplateSetup, skipTemplateSetup };
};

export default useHabits;
