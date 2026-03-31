import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useState } from "react";
import { colors, scale, spacing, fontSize, radius } from "../../../shared/theme";

const SleepInput = ({ onSubmit }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const handleSubmit = () => {
        onSubmit(date, parseInt(hours), parseInt(minutes));
        setHours('');
        setMinutes('');
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Hours</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={setHours}
                        value={hours}
                        placeholder="0"
                        placeholderTextColor={colors.textSecondary}
                        maxLength={2}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Minutes</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={setMinutes}
                        value={minutes}
                        placeholder="0"
                        placeholderTextColor={colors.textSecondary}
                        maxLength={2}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        margin: spacing.xl,
        marginTop: spacing.xl * 3
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        color: colors.textSecondary,
        fontSize: fontSize.sm,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.screenBackground,
        color: colors.textPrimary,
        fontSize: fontSize.lg,
        borderRadius: radius.sm,
        padding: spacing.sm,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    button: {
        backgroundColor: colors.primaryColor,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.screenBackground,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    },
});

export default SleepInput;