import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, radius, scale } from '../../shared/theme';
import useSleep from '../sleep/hooks/useSleep';
import { useTransactions } from '../money/hooks/useTransactions';
import useHabits from '../habits/hooks/useHabits';
import usePoints from '../../shared/usePoints';
import { calcSleepPoints } from '../sleep/utils/sleepModel';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PILLAR_HEIGHT = scale(180);
const MAX_POINTS = 300;

const pillarColor = (pct) => {
    if (pct >= 66) return colors.primaryColor;
    if (pct >= 33) return '#e0a020';
    return colors.expenseColor;
};

const Pillar = ({ label, icon, score }) => {
    const pct      = Math.min(Math.round(score), 100);
    const fillH    = Math.round(pct / 100 * PILLAR_HEIGHT);
    const color    = pillarColor(pct);

    return (
        <View style={styles.pillarWrapper}>
            <Text style={styles.pillarPct}>{pct}%</Text>
            <View style={[styles.pillarTrack, { height: PILLAR_HEIGHT }]}>
                <View style={[styles.pillarFill, { height: fillH, backgroundColor: color }]} />
            </View>
            <Ionicons name={icon} size={scale(20)} color={colors.textSecondary} style={styles.pillarIcon} />
            <Text style={styles.pillarLabel}>{label}</Text>
        </View>
    );
};

const StatsScreen = () => {
    const { sleep_entries }  = useSleep();
    const { transactions }   = useTransactions();
    const { dailyLog }       = useHabits();
    const { balance }        = usePoints();

    const today     = new Date();
    const month     = today.getMonth();
    const year      = today.getFullYear();
    const monthStr  = `${year}-${String(month + 1).padStart(2, '0')}`;
    const elapsed   = today.getDate(); // days elapsed this month (1-based, inclusive)

    // Sleep: avg bell-curve score this month, expressed as 0-100%
    const monthSleep = sleep_entries.filter(e => e.date.startsWith(monthStr));
    const sleepScore = monthSleep.length > 0
        ? (monthSleep.reduce((sum, e) => sum + calcSleepPoints(e.hours, e.minutes), 0) / monthSleep.length / 10) * 100
        : 0;

    // Habits: days in log this month / days elapsed
    const habitsScore = elapsed > 0
        ? (dailyLog.filter(d => d.startsWith(monthStr)).length / elapsed) * 100
        : 0;

    // Money: 0-spend days this month / days elapsed
    const expenseDates = new Set(
        transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(monthStr))
            .map(t => t.date)
    );
    let zeroSpendDays = 0;
    for (let d = 1; d <= elapsed; d++) {
        const dateStr = `${monthStr}-${String(d).padStart(2, '0')}`;
        if (!expenseDates.has(dateStr)) zeroSpendDays++;
    }
    const moneyScore = elapsed > 0 ? (zeroSpendDays / elapsed) * 100 : 0;

    // Points: balance / MAX_POINTS capped at 100%
    const pointsScore = Math.min(balance / MAX_POINTS, 1) * 100;

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>{MONTH_NAMES[month]}</Text>
            <View style={styles.pillars}>
                <Pillar label="Sleep"  icon="moon-outline"            score={sleepScore} />
                <Pillar label="Habits" icon="checkmark-circle-outline" score={habitsScore} />
                <Pillar label="Money"  icon="wallet-outline"           score={moneyScore} />
                <Pillar label="Points" icon="star-outline"             score={pointsScore} />
            </View>
            <View style={styles.legend}>
                <View style={styles.legendRow}>
                    <Text style={styles.legendNote}>Sleep — avg quality this month</Text>
                </View>
                <View style={styles.legendRow}>
                    <Text style={styles.legendNote}>Habits — daily goals completed / days elapsed</Text>
                </View>
                <View style={styles.legendRow}>
                    <Text style={styles.legendNote}>Money — 0-spend days / days elapsed</Text>
                </View>
                <View style={styles.legendRow}>
                    <Text style={styles.legendNote}>Points — balance / {MAX_POINTS}</Text>
                </View>
            </View>
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
    heading: {
        color: colors.textPrimary,
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    pillars: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginBottom: spacing.xl,
    },
    pillarWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    pillarPct: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.xs,
    },
    pillarTrack: {
        width: scale(36),
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.sm,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    pillarFill: {
        width: '100%',
        borderRadius: radius.sm,
    },
    pillarIcon: {
        marginTop: spacing.sm,
    },
    pillarLabel: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginTop: spacing.xs,
        textAlign: 'center',
    },
    legend: {
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        padding: spacing.md,
        gap: spacing.xs,
    },
    legendRow: {
        flexDirection: 'row',
    },
    legendNote: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
    },
});

export default StatsScreen;
