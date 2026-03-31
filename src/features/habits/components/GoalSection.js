import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../../shared/theme';
import GoalItem from './GoalItem';

const GoalSection = ({ title, type, goals, onAdd, onToggle, onDelete }) => {
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (!text.trim()) return;
        onAdd(text.trim(), type);
        setText('');
    };

    const sectionGoals = goals.filter(g => g.type === type);

    return (
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
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
                    onToggle={onToggle}
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
    title: {
        color: colors.primaryColor,
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
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
