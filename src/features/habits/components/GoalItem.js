import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, scale, spacing, fontSize, radius } from '../../../shared/theme';
import { isCompletedThisPeriod } from '../utils/habitsModel';

const GoalItem = ({ goal, onToggle, onDelete }) => {
    const completed = isCompletedThisPeriod(goal);

    return (
        <View style={styles.row}>
            <TouchableOpacity onPress={() => onToggle(goal.id)}>
                <Ionicons
                    name={completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={scale(24)}
                    color={completed ? colors.primaryColor : colors.textSecondary}
                />
            </TouchableOpacity>
            <Text style={[styles.text, completed && styles.textDone]}>
                {goal.text}
            </Text>
            <TouchableOpacity onPress={() => onDelete(goal.id)}>
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
    text: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: fontSize.md,
    },
    textDone: {
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
});

export default GoalItem;
