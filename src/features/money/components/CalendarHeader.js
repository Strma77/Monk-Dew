import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../../shared/theme';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


export default function CalendarHeader({ month, year, onPrevMonth, onNextMonth }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPrevMonth}>
                <Ionicons name="arrow-back-outline" size={32} color={colors.textPrimary}/>
            </TouchableOpacity>

            <Text style={styles.middleText}>{ MONTH_NAMES[month]} {year}</Text>

            <TouchableOpacity onPress={onNextMonth}>
                <Ionicons name="arrow-forward-outline" size={32} color={colors.textPrimary}/>
            </TouchableOpacity>
        </View>   
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md
    },
    middleText: {
        color: colors.textPrimary,
        fontSize: fontSize.lg,
        textAlign: 'center',
        flex: 1
    },
});