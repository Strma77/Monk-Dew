import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../../shared/theme';

const RewardItem = ({ reward, isActive, canBuy, onBuy }) => (
    <View style={[styles.card, isActive && styles.cardActive]}>
        <View style={styles.header}>
            <Text style={styles.name}>{reward.name}</Text>
            <Text style={styles.cost}>{reward.cost} pts</Text>
        </View>
        <Text style={styles.description}>{reward.description}</Text>
        <View style={styles.footer}>
            {isActive && (
                <View style={styles.activeBadge}>
                    <Text style={styles.activeText}>Active</Text>
                </View>
            )}
            <TouchableOpacity
                style={[styles.buyButton, !canBuy && styles.buyButtonDisabled]}
                onPress={onBuy}
                disabled={!canBuy}
            >
                <Text style={[styles.buyText, !canBuy && styles.buyTextDisabled]}>Buy</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    cardActive: {
        borderWidth: 1,
        borderColor: colors.primaryColor,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    name: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    },
    cost: {
        color: colors.primaryColor,
        fontSize: fontSize.sm,
        fontWeight: 'bold',
    },
    description: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: spacing.sm,
    },
    activeBadge: {
        backgroundColor: colors.primaryColor,
        borderRadius: radius.sm,
        paddingVertical: 2,
        paddingHorizontal: spacing.sm,
    },
    activeText: {
        color: colors.screenBackground,
        fontSize: fontSize.sm,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: colors.primaryColor,
        borderRadius: radius.sm,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
    },
    buyButtonDisabled: {
        backgroundColor: colors.borderColor,
    },
    buyText: {
        color: colors.screenBackground,
        fontSize: fontSize.sm,
        fontWeight: 'bold',
    },
    buyTextDisabled: {
        color: colors.textSecondary,
    },
});

export default RewardItem;
