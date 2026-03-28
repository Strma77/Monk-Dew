import { View, StyleSheet } from 'react-native';
import { getCalendarDays } from '../utils/calendarUtils';
import DayCell from './DayCell';

export default function CalendarGrid({year, month, dailyTotals, onDayPress}) {
    const calendarDays = getCalendarDays(year, month);

    return (
        <View style={styles.container}>
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
                    />
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})