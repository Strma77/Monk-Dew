import { View, Text, StyleSheet } from 'react-native';
import { colors , scale} from '../../../shared/theme';

export default function MonthlyTotal({ total }) {
    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Spent this month: </Text>
            <Text style={styles.totalStyle}>{total.toFixed(2)}</Text>
        </View>   
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceColor,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
         marginTop: scale(12),
    },
    textStyle: {
        color: colors.textSecondary,
    },
    totalStyle: {
        color: colors.textPrimary,
    }

})