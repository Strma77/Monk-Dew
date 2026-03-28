import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../shared/theme';

const GymScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Gym</Text>
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

export default GymScreen;