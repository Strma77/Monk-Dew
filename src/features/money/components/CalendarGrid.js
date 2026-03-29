import { View, Text, StyleSheet } from 'react-native';
import { getCalendarDays } from '../utils/calendarUtils';
import DayCell from './DayCell';
import { colors, fontSize, spacing, scale } from '../../../shared/theme';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarGrid({year, month, dailyTotals, onDayPress}) {
    const calendarDays = getCalendarDays(year, month);
    const today = new Date().toISOString().slice(0, 10);

    return (
        <View style={styles.container}>

            <View style={styles.weekRow}>
                {DAYS_OF_WEEK.map((day) => (
                    <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
            </View>

            {calendarDays.map((day, index) => {
                const dateKey = day
                    ? `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                    : null;
                
                return(
                    <DayCell 
                        key={index} 
                        day={day} 
                        hasTransaction={dateKey !== null && dailyTotals[dateKey] !== undefined } 
                        onPress={() => onDayPress(day)}
                        isNoSpend={day !== null && dateKey < today && dailyTotals[dateKey] === undefined}
                    />
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: scale(1),
        
    },
    weekRow: {
        flexDirection: 'row',
        width: '100%'
    },
    weekDayText: {
        width: '14.28%',
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        paddingVertical: spacing.xs
    }
})