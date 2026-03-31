import { View, StyleSheet, Share, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { colors, spacing } from "../../shared/theme";
import { useTransactions } from "./hooks/useTransactions";
import { getTotalSpent, getDailyTotals } from "./utils/calculations";
import { formatMonthExport } from "./utils/exportTransactions";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import MonthlyTotal from "./components/MonthlyTotal";
import TransactionModal from "./components/TransactionModal";
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system/legacy'

const MoneyScreen = () => {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, importTransactions } =
    useTransactions();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const totalSpent = getTotalSpent(transactions, currentMonth + 1, currentYear);
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

  const handleExport = async () => {
    const text = formatMonthExport(transactions, currentYear, currentMonth + 1);
    await Share.share({ message: text });
  };

  const handleImport = async () => {
    try{
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if(result.canceled) return;
      const text = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const parsed = JSON.parse(text);
      importTransactions(parsed);
      alert('Imported ' + parsed.length + ' transactions');
    } catch(e) {
      alert('Import failed: ' + e.message);
    }
  
  }

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
      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <Text style={styles.exportText}>Export as TXT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exportButton} onPress={handleImport}>
        <Text style={styles.exportText}>Import JSON</Text>
      </TouchableOpacity>
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
    paddingTop: spacing.xl,
  },
  textStyle: {
    color: colors.textPrimary,
    fontSize: 24,
  },
  exportButton: {
    backgroundColor: colors.surfaceColor,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  exportText: {
    color: colors.primaryColor,
    fontSize: 14,
  }
});

export default MoneyScreen;
