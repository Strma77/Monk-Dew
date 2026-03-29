import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { colors, spacing } from "../../shared/theme";
import { useTransactions } from "./hooks/useTransactions";
import { getTotalSpent, getDailyTotals } from "./utils/calculations";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import MonthlyTotal from "./components/MonthlyTotal";
import TransactionModal from "./components/TransactionModal";

const MoneyScreen = () => {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } =
    useTransactions();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const totalSpent = getTotalSpent(transactions);
  const dailyTotals = getDailyTotals(transactions);

  const handleDayPress = (day) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateKey);
    setModalVisible(true);
  };

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

  const dayTransactions = transactions.filter((t) => t.date === selectedDate);

  return (
    <View style={styles.container}>
      <CalendarHeader
        month={currentMonth}
        year={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <CalendarGrid
        month={currentMonth}
        year={currentYear}
        dailyTotals={dailyTotals}
        onDayPress={handleDayPress}
      />
      <MonthlyTotal total={totalSpent} />
      <TransactionModal
        visible={modalVisible}
        selectedDate={selectedDate}
        onClose={() => setModalVisible(false)}
        onSave={(data) => {
          addTransaction(data);
          setModalVisible(false);
        }}
        dayTransactions={dayTransactions}
        onDelete={deleteTransaction}
        onUpdate={(data) => {
          updateTransaction(data);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    padding: spacing.md,
  },
  textStyle: {
    color: colors.textPrimary,
    fontSize: 24,
  },
});

export default MoneyScreen;
