import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Expense } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import IconPlus from '@/svgs/IconPlus';
import IconSearch from '@/svgs/IconSearch';
import ExpenseItem from './ExpenseItem';
import ExpenseForm from './ExpenseForm';

interface ExpenseManagementProps {
  storeId: string;
}

const ExpenseManagement: React.FC<ExpenseManagementProps> = ({ storeId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Fetch expenses for the store
  const fetchExpenses = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await ExpenseService.getExpensesByStore(storeId);
      // setExpenses(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los gastos');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [storeId]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleSaveExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      if (editingExpense) {
        // Update existing expense
        // await ExpenseService.updateExpense(editingExpense.id, expenseData);
      } else {
        // Create new expense
        // await ExpenseService.createExpense({ ...expenseData, storeId });
      }
      setShowExpenseForm(false);
      fetchExpenses();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el gasto');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      // await ExpenseService.deleteExpense(expenseId);
      fetchExpenses();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el gasto');
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showExpenseForm) {
    return (
      <ExpenseForm
        initialData={editingExpense}
        onSave={handleSaveExpense}
        onCancel={() => setShowExpenseForm(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSearch width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar gastos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <IconPlus width={20} height={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <CustomText style={styles.summaryLabel}>Total Gastos:</CustomText>
          <CustomText style={styles.summaryValue}>
            ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
          </CustomText>
        </View>
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
        contentContainerStyle={styles.expenseList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CustomText>No hay gastos registrados</CustomText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8a5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    backgroundColor: '#f8f5ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8a5cf6',
  },
  expenseList: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});

export default ExpenseManagement;
