import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import IconEdit from '@/svgs/IconEdit';
import IconDelete from '@/svgs/IconDelete';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit, onDelete }) => {
  const formattedDate = format(new Date(expense.date), 'PPP', { locale: es });

  return (
    <View style={styles.container}>
      <View style={styles.expenseInfo}>
        <View style={styles.header}>
          <CustomText style={styles.amount}>${expense.amount.toFixed(2)}</CustomText>
          {expense.category && (
            <View style={styles.categoryBadge}>
              <CustomText style={styles.categoryText}>{expense.category}</CustomText>
            </View>
          )}
        </View>
        
        <CustomText style={styles.description} numberOfLines={1}>
          {expense.description}
        </CustomText>
        
        <View style={styles.footer}>
          <CustomText style={styles.date}>{formattedDate}</CustomText>
          <CustomText style={styles.paymentMethod}>
            {expense.paymentMethod || 'Efectivo'}
          </CustomText>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(expense)}
        >
          <IconEdit width={18} height={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(expense.id)}
        >
          <IconDelete width={18} height={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  expenseInfo: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8a5cf6',
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#f0e9ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#8a5cf6',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  deleteButton: {
    marginLeft: 0,
  },
});

export default ExpenseItem;
