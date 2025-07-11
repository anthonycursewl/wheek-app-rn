import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Receipt } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import IconPlus from '@/svgs/IconPlus';
import IconSearch from '@/svgs/IconSearch';
import ReceiptItem from './ReceiptItem';
import ReceiptForm from './ReceiptForm';

interface ReceiptManagementProps {
  storeId: string;
}

const ReceiptManagement: React.FC<ReceiptManagementProps> = ({ storeId }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);

  // Fetch receipts for the store
  const fetchReceipts = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await ReceiptService.getReceiptsByStore(storeId);
      // setReceipts(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los recibos');
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [storeId]);

  const handleAddReceipt = () => {
    setEditingReceipt(null);
    setShowReceiptForm(true);
  };

  const handleEditReceipt = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    setShowReceiptForm(true);
  };

  const handleSaveReceipt = async (receiptData: Omit<Receipt, 'id'>) => {
    try {
      if (editingReceipt) {
        // Update existing receipt
        // await ReceiptService.updateReceipt(editingReceipt.id, receiptData);
      } else {
        // Create new receipt
        // await ReceiptService.createReceipt({ ...receiptData, storeId });
      }
      setShowReceiptForm(false);
      fetchReceipts();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el recibo');
    }
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    try {
      // await ReceiptService.deleteReceipt(receiptId);
      fetchReceipts();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el recibo');
    }
  };

  const filteredReceipts = receipts.filter(receipt =>
    receipt.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showReceiptForm) {
    return (
      <ReceiptForm
        initialData={editingReceipt}
        onSave={handleSaveReceipt}
        onCancel={() => setShowReceiptForm(false)}
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
            placeholder="Buscar recibos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddReceipt}>
          <IconPlus width={20} height={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <CustomText style={styles.summaryLabel}>Total Recibos:</CustomText>
          <CustomText style={styles.summaryValue}>
            {receipts.length}
          </CustomText>
        </View>
        <View style={styles.summaryItem}>
          <CustomText style={styles.summaryLabel}>Monto Total:</CustomText>
          <CustomText style={styles.summaryValue}>
            ${receipts.reduce((sum, rec) => sum + rec.total, 0).toFixed(2)}
          </CustomText>
        </View>
      </View>

      <FlatList
        data={filteredReceipts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReceiptItem
            receipt={item}
            onEdit={handleEditReceipt}
            onDelete={handleDeleteReceipt}
          />
        )}
        contentContainerStyle={styles.receiptList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CustomText>No hay recibos registrados</CustomText>
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
    backgroundColor: '#f0f9ff',
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
    color: '#0ea5e9',
  },
  receiptList: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});

export default ReceiptManagement;
