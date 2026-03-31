import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../shared/theme';
import useStore from './hooks/useStore';
import usePoints from '../../shared/usePoints';
import WishlistItem from './components/WishlistItem';

const ITEM_COST = 50;

const StoreScreen = () => {
    const { items, addItem, buyItem, deleteItem } = useStore();
    const { balance, multiplier, isLockedOut, spendPoints } = usePoints();
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (!text.trim()) return;
        addItem(text.trim());
        setText('');
    };

    const handleBuy = (id) => {
        if (isLockedOut) {
            Alert.alert('Store locked', 'You missed 3+ days in a row. Store unlocks in 24h.');
            return;
        }
        if (balance < ITEM_COST) {
            Alert.alert('Not enough points', `You need ${ITEM_COST} pts to buy. You have ${balance}.`);
            return;
        }
        Alert.alert('Confirm purchase', `Spend ${ITEM_COST} points? This means you can buy it IRL.`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Buy', onPress: () => { spendPoints(ITEM_COST); buyItem(id); } },
        ]);
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.balanceRow}>
                <View>
                    <Text style={styles.balanceLabel}>Points</Text>
                    <Text style={styles.balanceValue}>{balance}</Text>
                </View>
                {multiplier > 1 && (
                    <View style={styles.multiplierBadge}>
                        <Text style={styles.multiplierText}>{multiplier.toFixed(1)}x</Text>
                    </View>
                )}
            </View>

            {isLockedOut && (
                <View style={styles.lockoutBanner}>
                    <Text style={styles.lockoutText}>Store locked — missed 3+ days. Unlocks in 24h.</Text>
                </View>
            )}

            <Text style={styles.heading}>Wishlist</Text>
            <Text style={styles.subtext}>Items unlock after 5 days. Buy costs {ITEM_COST} pts = permission to buy IRL.</Text>

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
                    onBuy={handleBuy}
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
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    balanceLabel: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
    },
    balanceValue: {
        color: colors.primaryColor,
        fontSize: fontSize.xxl,
        fontWeight: 'bold',
    },
    multiplierBadge: {
        backgroundColor: colors.primaryColor,
        borderRadius: radius.sm,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    multiplierText: {
        color: colors.screenBackground,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    },
    lockoutBanner: {
        backgroundColor: colors.expenseColor,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    lockoutText: {
        color: colors.textPrimary,
        fontSize: fontSize.sm,
        textAlign: 'center',
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
