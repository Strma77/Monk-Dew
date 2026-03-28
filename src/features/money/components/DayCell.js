import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { colors, fontSize, radius } from '../../../shared/theme';

export default function DayCell({day, hasTransaction, onPress}) {

    if(day === null){
        return <View style={styles.cell}/>;
    }

    return (
        <TouchableOpacity style={styles.cell} onPress={onPress}>
            <Text style={styles.dayText}>{day}</Text>
            {hasTransaction && <View style={styles.dot}/>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '14.00%',
        height: 52,
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.sm,
        margin: 1.4
    },
    dayText: {
        color: colors.textPrimary,
        fontSize: fontSize.xxl
    },
    dot: {
        borderRadius: 4,
        width: 8,
        height: 8,
        backgroundColor: colors.primaryColor,
        alignSelf: 'center'
    }
})