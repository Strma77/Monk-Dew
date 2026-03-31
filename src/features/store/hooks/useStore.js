import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createItem } from "../utils/storeModel";

const useStore = () => {
    const [items, setItems] = useState([]);

    const loadData = async () => {
        const stored = await AsyncStorage.getItem('store');
        if (stored) setItems(JSON.parse(stored));
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveToStorage = async (updated) => {
        await AsyncStorage.setItem('store', JSON.stringify(updated));
    };

    const addItem = (name) => {
        const newItem = createItem(name);
        const updated = [...items, newItem];
        setItems(updated);
        saveToStorage(updated);
    };

    const deleteItem = (id) => {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        saveToStorage(updated);
    };

    const buyItem = (id) => {
        deleteItem(id);
    };

    return { items, addItem, deleteItem, buyItem };
};

export default useStore;
