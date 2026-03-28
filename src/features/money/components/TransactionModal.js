import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useState } from 'react';
import { colors, spacing, fontSize, radius } from '../../../shared/theme';

export default function TransactionModal({visible, selectedDate, onSave, onClose}) {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');

    return (
        <Modal visible={visible} animationType="slide" transparent={true} >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Log for {selectedDate}</Text>
                    <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType='numeric'></TextInput>
                    <TextInput style={styles.input} value={note} onChangeText={setNote}></TextInput>
                    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    card: {
        backgroundColor: colors.surfaceColor,
        padding: spacing.lg,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: fontSize.lg,
        marginBottom: spacing.md,
    },
    input: {
        backgroundColor: colors.screenBackground,
        color: colors.textPrimary,
        padding: spacing.sm,
        borderRadius: radius.sm,
        marginBottom: spacing.md,
        fontSize: fontSize.md,
    },
    saveButton: {
        backgroundColor: colors.primaryColor,
        padding: spacing.md,
        borderRadius: radius.sm,
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    cancelButton: {
        padding: spacing.md,
        borderRadius: radius.sm,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    buttonText: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
    },
});

