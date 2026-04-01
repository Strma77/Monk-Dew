import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../shared/theme';
import useHabits from './hooks/useHabits';
import usePoints from '../../shared/usePoints';
import useRewards from '../store/hooks/useRewards';
import GoalSection from './components/GoalSection';
import { scheduleMissedHabitsWarning, cancelMissedHabitsWarning } from '../../shared/notifications';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const HabitsScreen = () => {
    const { goals, addGoal, toggleGoal, deleteGoal, showTemplateSetup, completeTemplateSetup, skipTemplateSetup } = useHabits();
    const { checkPenalties, earnSection } = usePoints();
    const { activeRewards, consumeReward } = useRewards();

    const [templateInput, setTemplateInput] = useState('');
    const [templateList, setTemplateList] = useState([]);

    useEffect(() => {
        if (goals.length === 0) return;
        checkPenalties(goals, activeRewards, consumeReward);

        // Schedule or cancel tomorrow's missed-habits warning based on yesterday's completion
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const yesterdayStr = yest.toISOString().slice(0, 10);
        const dailyGoals = goals.filter(g => g.type === 'daily');
        const allDoneYesterday = dailyGoals.length === 0 || dailyGoals.every(g => g.completedOn === yesterdayStr);
        if (allDoneYesterday) cancelMissedHabitsWarning();
        else scheduleMissedHabitsWarning();
    }, [goals]);

    const handleTemplateAdd = () => {
        if (!templateInput.trim()) return;
        setTemplateList(prev => [...prev, templateInput.trim()]);
        setTemplateInput('');
    };

    const handleTemplateRemove = (index) => {
        setTemplateList(prev => prev.filter((_, i) => i !== index));
    };

    const handleTemplateConfirm = () => {
        completeTemplateSetup(templateList);
        setTemplateList([]);
        setTemplateInput('');
    };

    const handleTemplateSkip = () => {
        skipTemplateSetup();
        setTemplateList([]);
        setTemplateInput('');
    };

    const monthName = MONTH_NAMES[new Date().getMonth()];

    return (
        <>
            <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
                <GoalSection
                    title="Daily Goals"
                    type="daily"
                    goals={goals}
                    onAdd={addGoal}
                    onToggle={toggleGoal}
                    onDelete={deleteGoal}
                    onSectionComplete={earnSection}
                />
                <GoalSection
                    title="Weekly Goals"
                    type="weekly"
                    goals={goals}
                    onAdd={addGoal}
                    onToggle={toggleGoal}
                    onDelete={deleteGoal}
                    onSectionComplete={earnSection}
                />
                <GoalSection
                    title="Monthly Goals"
                    type="monthly"
                    goals={goals}
                    onAdd={addGoal}
                    onToggle={toggleGoal}
                    onDelete={deleteGoal}
                    onSectionComplete={earnSection}
                />
            </ScrollView>

            <Modal visible={showTemplateSetup} animationType="slide" transparent>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Set up {monthName} daily habits</Text>
                        <Text style={styles.modalSub}>These become your fixed daily goals for the month.</Text>

                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Add a habit..."
                                placeholderTextColor={colors.textSecondary}
                                value={templateInput}
                                onChangeText={setTemplateInput}
                                onSubmitEditing={handleTemplateAdd}
                                returnKeyType="done"
                            />
                            <TouchableOpacity style={styles.addButton} onPress={handleTemplateAdd}>
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {templateList.map((item, i) => (
                            <View key={i} style={styles.templateItem}>
                                <Text style={styles.templateItemText}>{item}</Text>
                                <TouchableOpacity onPress={() => handleTemplateRemove(i)}>
                                    <Text style={styles.removeText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.skipButton} onPress={handleTemplateSkip}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleTemplateConfirm}>
                                <Text style={styles.confirmText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
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
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: colors.screenBackground,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    modalTitle: {
        color: colors.textPrimary,
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    modalSub: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.lg,
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
    templateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.xs,
        borderLeftWidth: 3,
        borderLeftColor: colors.primaryColor,
    },
    templateItemText: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
        flex: 1,
    },
    removeText: {
        color: colors.textSecondary,
        fontSize: fontSize.md,
        paddingLeft: spacing.sm,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    skipButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    skipText: {
        color: colors.textSecondary,
        fontSize: fontSize.md,
    },
    confirmButton: {
        backgroundColor: colors.primaryColor,
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    confirmText: {
        color: colors.screenBackground,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    },
});

export default HabitsScreen;
