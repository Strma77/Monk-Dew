import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { colors } from "../../shared/theme";
import { useSleep } from "./hooks/useSleep";
import SleepInput from "./components/SleepInput"

const SleepScreen = () => {
  const {
    sleep_entries,
    addSleep,
    deleteSleep,
    updateSleep,
  } = useSleep();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <View style={styles.container}>
      <SleepInput onSubmit={addSleep}></SleepInput>
      <Text>GRAPH</Text>
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
    fontSize: 24,
  },
});

export default SleepScreen;