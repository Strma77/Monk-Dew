import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../shared/theme';
import useStore from './hooks/useStore';
import WishlistItem from './components/WishlistItem';

const StoreScreen = () => {
    const { items, addItem, buyItem, deleteItem } = useStore();
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (!text.trim()) return;
        addItem(text.trim());
        setText('');
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Wishlist</Text>
            <Text style={styles.subtext}>Items unlock after 5 days. Buy = permission to buy IRL.</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Add an item..."
                    placeholderTextColor={colors.textSecondary}
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            {items.map(item => (
                <WishlistItem
                    key={item.id}
                    item={item}
                    onBuy={buyItem}
                    onDelete={deleteItem}
                />
            ))}
            {items.length === 0 && (
                <Text style={styles.empty}>No items in wishlist.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
    },
    heading: {
        color: colors.textPrimary,
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    subtext: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.lg,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    input: {
        flex: 1,
        backgroundColor: colors.surfaceColor,
        color: colors.textPrimary,
        fontSize: fontSize.md,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    addButton: {
        backgroundColor: colors.primaryColor,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: colors.screenBackground,
        fontSize: fontSize.xl,
        fontWeight: 'bold',
    },
    empty: {
        color: colors.textSecondary,
        fontSize: fontSize.md,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
});

export default StoreScreen;
