import { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing } from '../../shared/theme';
import useHabits from './hooks/useHabits';
import usePoints from '../../shared/usePoints';
import GoalSection from './components/GoalSection';

const HabitsScreen = () => {
    const { goals, addGoal, toggleGoal, deleteGoal } = useHabits();
    const { checkPenalties, earnSection } = usePoints();

    useEffect(() => {
        if (goals.length > 0) checkPenalties(goals);
    }, [goals]);

    return (
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
});

export default HabitsScreen;
