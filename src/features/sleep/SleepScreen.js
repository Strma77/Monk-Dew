import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSize } from "../../shared/theme";
import useSleep from "./hooks/useSleep";
import SleepInput from "./components/SleepInput";
import SleepGraph from "./components/SleepGraph";

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SleepScreen = () => {
  const { sleep_entries, addSleep, clearSleep } = useSleep();

  const handleClear = () => {
    Alert.alert('Clear sleep data', 'This will delete all sleep entries. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearSleep },
    ]);
  };
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="arrow-back-outline" size={32} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{MONTH_NAMES[currentMonth]} {currentYear}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="arrow-forward-outline" size={32} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <SleepInput onSubmit={addSleep} currentMonth={currentMonth} currentYear={currentYear} />
      <SleepGraph entries={sleep_entries} currentMonth={currentMonth} currentYear={currentYear} />
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearText}>Clear sleep data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.md,
  },
  clearText: {
    color: colors.expenseColor,
    fontSize: fontSize.sm,
  },
});

export default SleepScreen;
