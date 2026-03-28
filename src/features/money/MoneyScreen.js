import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../shared/theme';

const MoneyScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Money</Text>
        </View>   
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    textStyle: {
        color: colors.textPrimary,
        fontSize: 24
    },
});

export default MoneyScreen;