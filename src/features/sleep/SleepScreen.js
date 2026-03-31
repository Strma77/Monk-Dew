import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, fontSize } from "../../shared/theme";
import { useSleep } from "./hooks/useSleep";
import SleepInput from "./components/SleepInput";
import SleepGraph from "./components/SleepGraph";

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SleepScreen = () => {
  const { sleep_entries, addSleep } = useSleep();
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
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    flex: 1,
    textAlign: 'center',
  },
});

export default SleepScreen;
