import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSize, radius } from "../../../shared/theme";

const TODAY = new Date();

const SleepInput = ({ onSubmit, currentMonth, currentYear }) => {
    const isCurrentMonth = TODAY.getMonth() === currentMonth && TODAY.getFullYear() === currentYear;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const defaultDay = isCurrentMonth ? TODAY.getDate() : 1;
    const maxDay = isCurrentMonth ? TODAY.getDate() : daysInMonth;

    const [day, setDay] = useState(defaultDay);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const isCurrent = TODAY.getMonth() === currentMonth && TODAY.getFullYear() === currentYear;
        setDay(isCurrent ? TODAY.getDate() : 1);
    }, [currentMonth, currentYear]);

    const handlePrevDay = () => {
        if (day > 1) setDay(day - 1);
    };

    const handleNextDay = () => {
        if (day < maxDay) setDay(day + 1);
    };

    const handleSubmit = () => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onSubmit(dateStr, parseInt(hours), parseInt(minutes));
        setHours('');
        setMinutes('');
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    return (
        <View style={styles.container}>
            <View style={styles.dateRow}>
                <Text style={styles.label}>Day</Text>
                <View style={styles.dayStepper}>
                    <TouchableOpacity onPress={handlePrevDay} disabled={day === 1}>
                        <Ionicons name="chevron-back" size={22} color={day === 1 ? colors.textSecondary : colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.dayText}>{day}</Text>
                    <TouchableOpacity onPress={handleNextDay} disabled={day === maxDay}>
                        <Ionicons name="chevron-forward" size={22} color={day === maxDay ? colors.textSecondary : colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>
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
                <TouchableOpacity style={[styles.button, saved && styles.buttonSaved]} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>{saved ? '✓' : 'Save'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        backgroundColor: colors.surfaceColor,
        borderRadius: radius.md,
        margin: spacing.xl,
        marginTop: spacing.xl * 3,
    },
    dateRow: {
        marginBottom: spacing.sm,
    },
    dayStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.screenBackground,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        justifyContent: 'space-between',
    },
    dayText: {
        color: colors.textPrimary,
        fontSize: fontSize.lg,
        minWidth: 30,
        textAlign: 'center',
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
    buttonSaved: {
        backgroundColor: colors.incomeColor,
    },
    buttonText: {
        color: colors.screenBackground,
        fontSize: fontSize.md,
        fontWeight: 'bold',
    },
});

export default SleepInput;
