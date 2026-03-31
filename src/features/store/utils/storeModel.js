export const createItem = (name) => ({
    id: Date.now().toString(),
    name,
    addedOn: new Date().toISOString().slice(0, 10),
});

export const daysUntilUnlocked = (item) => {
    const added = new Date(item.addedOn);
    const today = new Date();
    const diffMs = today - added;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, 5 - diffDays);
};
