import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { colors, spacing, fontSize, radius } from "../../../shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";

const EXPENSE_CATEGORIES = [
  "Kava",
  "Uber",
  "Pekara",
  "Menza",
  "Pivo",
  "Fast Food",
  "Other",
];
const INCOME_CATEGORIES = ["Tata", "Mama", "Poker", "Prodao", "Other"];

export default function TransactionModal({
  visible,
  selectedDate,
  onSave,
  onClose,
  dayTransactions,
  onUpdate,
  onDelete,
}) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    if (visible) {
      setAmount("");
      setType("expense");
      setCategory("");
      setNote("");
      setCustomCategory("");
      setEditingTransaction(null);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView>
                <View style={styles.card}>
                  <Text style={styles.title}>Log for {selectedDate}</Text>
                  <View style={styles.typeToggle}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        type === "expense" && styles.typeButtonActive,
                      ]}
                      onPress={() => setType("expense")}
                    >
                      <Text style={styles.buttonText}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        type === "income" && styles.typeButtonActive,
                      ]}
                      onPress={() => setType("income")}
                    >
                      <Text style={styles.buttonText}>Income</Text>
                    </TouchableOpacity>
                  </View>

                  {dayTransactions &&
                    dayTransactions.map((t) => (
                      <View key={t.id} style={styles.transactionRow}>
                        <Text
                          style={[
                            styles.transactionText,
                            {
                              color:
                                t.type === "expense"
                                  ? colors.expenseColor
                                  : colors.incomeColor,
                            },
                          ]}
                        >
                          {t.amount}€ — {t.category}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingTransaction(t);
                            setAmount(t.amount.toString());
                            setType(t.type);
                            setCategory(t.category);
                            setNote(t.note);
                          }}
                        >
                          <Ionicons
                            name="pencil-outline"
                            color={colors.primaryColor}
                            size={fontSize.xl}
                            style={{ marginLeft: spacing.sm }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDelete(t)}>
                          <Ionicons
                            name="trash-outline"
                            color={colors.expenseColor}
                            size={fontSize.xl}
                            style={{ marginLeft: spacing.sm }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}

                  <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="eg. 10"
                  ></TextInput>
                  <View style={styles.viewCategory}>
                    {type === "expense"
                      ? EXPENSE_CATEGORIES.map((c) => (
                          <TouchableOpacity
                            style={[
                              styles.category,
                              category === c && styles.categoryActive,
                            ]}
                            onPress={() => setCategory(c)}
                            key={c}
                          >
                            <Text style={styles.categoryText}>{c}</Text>
                          </TouchableOpacity>
                        ))
                      : INCOME_CATEGORIES.map((c) => (
                          <TouchableOpacity
                            style={[
                              styles.category,
                              category === c && styles.categoryActive,
                            ]}
                            onPress={() => setCategory(c)}
                            key={c}
                          >
                            <Text style={styles.categoryText}>{c}</Text>
                          </TouchableOpacity>
                        ))}
                  </View>
                  {category === "Other" && (
                    <TextInput
                      style={styles.input}
                      value={customCategory}
                      onChangeText={setCustomCategory}
                      placeholder="Specify..."
                    />
                  )}
                  <TextInput
                    style={styles.input}
                    value={note}
                    onChangeText={setNote}
                    placeholder="description"
                  ></TextInput>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                      const finalCategory =
                        category === "Other" ? customCategory : category;
                      if (editingTransaction) {
                        onUpdate({
                          ...editingTransaction,
                          amount: parseFloat(amount),
                          type,
                          category: finalCategory,
                          note,
                        });
                      } else {
                        onSave({
                          date: selectedDate,
                          amount: parseFloat(amount),
                          type,
                          category: finalCategory,
                          note,
                        });
                        onClose();
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
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
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    marginBottom: spacing.xs,
  },
  transactionText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.sm,
  },
});
