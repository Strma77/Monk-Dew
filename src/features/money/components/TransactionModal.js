import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { colors, spacing, fontSize, radius } from '../../../shared/theme';

const EXPENSE_CATEGORIES = ['Kava', 'Uber', 'Pekara', 'Menza', 'Pivo', 'Fast Food', 'Other'];
const INCOME_CATEGORIES = ['Tata', 'Mama', 'Poker', 'Prodao', 'Other'];

export default function TransactionModal({visible, selectedDate, onSave, onClose}) {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [customCategory, setCustomCategory] = useState('');

    useEffect( () => {
        if(visible) {
            setAmount('');
            setType('expense');
            setCategory('');
            setNote('');
            setCustomCategory('');
        }
    }, [visible]);

    return (
        <Modal visible={visible} animationType="slide" transparent={true} >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Log for {selectedDate}</Text>
                    <View style={styles.typeToggle}>
                        <TouchableOpacity
                            style={[styles.typeButton, type==='expense' && styles.typeButtonActive]}
                            onPress={() => setType('expense')}
                        >
                            <Text style={styles.buttonText}>Expense</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type==='income' && styles.typeButtonActive]}
                            onPress={() => setType('income')}
                        >
                            <Text style={styles.buttonText}>Income</Text>    
                        </TouchableOpacity>
                    </View>
                    <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType='numeric' placeholder='eg. 10'></TextInput>
                    <View style={styles.viewCategory}>
                        {type === 'expense' ? (
                            EXPENSE_CATEGORIES.map((c) => (
                                <TouchableOpacity style={[styles.category, category === c && styles.categoryActive]} onPress={() => setCategory(c)} key={c}>
                                    <Text style={styles.categoryText}>{c}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            INCOME_CATEGORIES.map((c) => (
                                <TouchableOpacity style={[styles.category, category === c && styles.categoryActive]} onPress={() => setCategory(c)} key={c}>
                                    <Text style={styles.categoryText}>{c}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                    {category === 'Other' && <TextInput style={styles.input} value={customCategory} onChangeText={setCustomCategory} placeholder='Specify...' />}
                    <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder='description'></TextInput>
                    <TouchableOpacity style={styles.saveButton} onPress={() => { onSave( {date: selectedDate, amount: parseFloat(amount), type, category: category === 'Other' ? customCategory : category, note }); onClose();}}>
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
  viewCategory: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  category: {
    backgroundColor: colors.screenBackground,
    padding: spacing.sm,
    borderRadius: radius.sm,
    margin: spacing.xs,
  },
  categoryActive: {
    backgroundColor: colors.primaryColor,
  },
  typeToggle: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.sm,
    alignItems: "center",
    backgroundColor: colors.screenBackground,
  },
  typeButtonActive: {
    backgroundColor: colors.primaryColor,
  },
  categoryText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
  },
});

