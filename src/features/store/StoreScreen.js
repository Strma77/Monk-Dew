import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../shared/theme';
import useStore from './hooks/useStore';
import usePoints from '../../shared/usePoints';
import useRewards from './hooks/useRewards';
import WishlistItem from './components/WishlistItem';
import RewardItem from './components/RewardItem';
import { REWARDS } from './utils/rewardsConfig';

const ITEM_COST = 50;

const StoreScreen = () => {
    const { items, addItem, buyItem, deleteItem } = useStore();
    const { balance, multiplier, isLockedOut, spendPoints, isPointBoostActive, activeFocusSection, activatePointBoost, activateFocus } = usePoints();
    const { canPurchaseNow, cooldownHoursLeft, purchaseReward, isActive } = useRewards();
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

    const handleRewardBuy = (reward) => {
        if (isLockedOut) {
            Alert.alert('Store locked', 'You missed 3+ days in a row. Store unlocks in 24h.');
            return;
        }
        if (!canPurchaseNow()) {
            Alert.alert('Cooldown', `Wait ${cooldownHoursLeft()}h before your next reward purchase.`);
            return;
        }
        if (balance < reward.cost) {
            Alert.alert('Not enough points', `You need ${reward.cost} pts. You have ${balance}.`);
            return;
        }
        if (reward.type === 'focus') {
            Alert.alert('Focus — choose a section', 'Which section to boost for 7 days?', [
                { text: 'Daily',   onPress: () => confirmRewardBuy(reward, 'daily') },
                { text: 'Weekly',  onPress: () => confirmRewardBuy(reward, 'weekly') },
                { text: 'Monthly', onPress: () => confirmRewardBuy(reward, 'monthly') },
                { text: 'Cancel',  style: 'cancel' },
            ]);
            return;
        }
        confirmRewardBuy(reward, null);
    };

    const confirmRewardBuy = (reward, focusSection) => {
        Alert.alert('Confirm', `Buy ${reward.name} for ${reward.cost} pts?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Buy',
                onPress: () => {
                    spendPoints(reward.cost);
                    if (reward.type === 'pointBoost') {
                        activatePointBoost();
                    } else if (reward.type === 'focus') {
                        activateFocus(focusSection);
                        purchaseReward(reward.type, { section: focusSection });
                    } else {
                        purchaseReward(reward.type);
                    }
                },
            },
        ]);
    };

    const getIsActive = (type) => {
        if (type === 'pointBoost') return isPointBoostActive;
        if (type === 'focus') return activeFocusSection != null;
        return isActive(type);
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

            <Text style={styles.heading}>Rewards</Text>
            <Text style={styles.subtext}>Permanent shop. 2-day cooldown between purchases.</Text>
            {!canPurchaseNow() && (
                <Text style={styles.cooldownText}>{cooldownHoursLeft()}h until next purchase</Text>
            )}
            {REWARDS.map(reward => (
                <RewardItem
                    key={reward.type}
                    reward={reward}
                    isActive={getIsActive(reward.type)}
                    canBuy={canPurchaseNow() && balance >= reward.cost && !isLockedOut}
                    onBuy={() => handleRewardBuy(reward)}
                />
            ))}

            <Text style={[styles.heading, styles.wishlistHeading]}>Wishlist</Text>
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
    wishlistHeading: {
        marginTop: spacing.xl,
    },
    subtext: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.sm,
    },
    cooldownText: {
        color: colors.expenseColor,
        fontSize: fontSize.sm,
        marginBottom: spacing.md,
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
