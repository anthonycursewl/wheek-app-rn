import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Receipt } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import IconEdit from '@/svgs/IconEdit';
import IconDelete from '@/svgs/IconDelete';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReceiptItemProps {
  receipt: Receipt;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receiptId: string) => void;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ receipt, onEdit, onDelete }) => {
  const formattedDate = format(new Date(receipt.date), 'PPP', { locale: es });

  return (
    <View style={styles.container}>
      <View style={styles.receiptInfo}>
        <View style={styles.header}>
          <CustomText style={styles.amount}>${receipt.total.toFixed(2)}</CustomText>
          {receipt.receiptNumber && (
            <View style={styles.receiptNumberBadge}>
              <CustomText style={styles.receiptNumberText}>#{receipt.receiptNumber}</CustomText>
            </View>
          )}
        </View>
        
        <View style={styles.details}>
          <CustomText style={styles.provider} numberOfLines={1}>
            {receipt.providerName || 'Proveedor no especificado'}
          </CustomText>
          <CustomText style={styles.date}>{formattedDate}</CustomText>
        </View>
        
        {receipt.notes && (
          <CustomText style={styles.notes} numberOfLines={2}>
            {receipt.notes}
          </CustomText>
        )}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onEdit(receipt)}
        >
          <IconEdit width={18} height={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(receipt.id)}
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
  receiptInfo: {
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
    color: '#0ea5e9',
    marginRight: 8,
  },
  receiptNumberBadge: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  receiptNumberText: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  provider: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
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

export default ReceiptItem;
