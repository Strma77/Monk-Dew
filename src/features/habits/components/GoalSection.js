import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../../shared/theme';
import GoalItem from './GoalItem';
import { isCompletedThisPeriod } from '../utils/habitsModel';

const GoalSection = ({ title, type, goals, onAdd, onToggle, onDelete, onSectionComplete }) => {
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (!text.trim()) return;
        onAdd(text.trim(), type);
        setText('');
    };

    const sectionGoals = goals.filter(g => g.type === type);
    const completedCount = sectionGoals.filter(g => isCompletedThisPeriod(g)).length;
    const total = sectionGoals.length;

    return (
        <View style={styles.section}>
            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {total > 0 && (
                    <Text style={[styles.progress, completedCount === total && styles.progressDone]}>
                        {completedCount}/{total}
                    </Text>
                )}
            </View>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a goal..."
                    placeholderTextColor={colors.textSecondary}
                    value={text}
                    onChangeText={setText}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            {sectionGoals.map(goal => (
                <GoalItem
                    key={goal.id}
                    goal={goal}
                    onToggle={(id) => onToggle(id, onSectionComplete)}
                    onDelete={onDelete}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: spacing.lg,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        color: colors.primaryColor,
        fontSize: fontSize.lg,
        fontWeight: 'bold',
    },
    progress: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
    },
    progressDone: {
        color: colors.primaryColor,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
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
});

export default GoalSection;
