import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, scale, spacing, fontSize, radius } from '../../../shared/theme';
import { daysUntilUnlocked } from '../utils/storeModel';

const WishlistItem = ({ item, onBuy, onDelete }) => {
    const daysLeft = daysUntilUnlocked(item);
    const unlocked = daysLeft === 0;

    return (
        <View style={styles.row}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.status}>
                    {unlocked ? 'Ready to buy' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`}
                </Text>
            </View>
            {unlocked && (
                <TouchableOpacity style={styles.buyButton} onPress={() => onBuy(item.id)}>
                    <Text style={styles.buyText}>Buy</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={scale(18)} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        marginBottom: spacing.xs,
    },
    info: {
        flex: 1,
    },
    name: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
    },
    status: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginTop: 2,
    },
    buyButton: {
        backgroundColor: colors.primaryColor,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: radius.sm,
    },
    buyText: {
        color: colors.screenBackground,
        fontSize: fontSize.sm,
        fontWeight: 'bold',
    },
});

export default WishlistItem;
