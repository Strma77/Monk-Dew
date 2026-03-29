import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { colors, fontSize, radius, vScale, scale } from '../../../shared/theme';


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
        width: `${100/7}%`,
        height: vScale(48),
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.sm,
        paddingVertical: scale(2),
    },
    dayText: {
        color: colors.textPrimary,
        fontSize: fontSize.md
    },
    dot: {
        borderRadius: 4,
        width: 8,
        height: 8,
        backgroundColor: colors.primaryColor,
        alignSelf: 'center'
    }
})