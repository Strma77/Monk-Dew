import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, radius } from '../../../shared/theme';

const DAYS = 28;
const COLS = 7;

const HabitsHistory = ({ dailyLog }) => {
    const logSet = new Set(dailyLog);
    const today = new Date();

    // Build array of the past 28 days, index 0 = oldest
    const dates = Array.from({ length: DAYS }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (DAYS - 1 - i));
        return d.toISOString().slice(0, 10);
    });

    const rows = [];
    for (let r = 0; r < DAYS / COLS; r++) {
        rows.push(dates.slice(r * COLS, r * COLS + COLS));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily — Past 4 Weeks</Text>
            {rows.map((week, r) => (
                <View key={r} style={styles.row}>
                    {week.map(date => (
                        <View
                            key={date}
                            style={[styles.dot, logSet.has(date) && styles.dotDone]}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.lg,
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        padding: spacing.md,
    },
    title: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.sm,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    dot: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: radius.sm,
        backgroundColor: colors.screenBackground,
    },
    dotDone: {
        backgroundColor: colors.primaryColor,
    },
});

export default HabitsHistory;
