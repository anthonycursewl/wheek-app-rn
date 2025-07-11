import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StoreData } from '../../../../flux/entities/Store';
import { useGlobalStore } from 'flux/stores/useGlobalStore';
import LayoutScreen from 'components/Layout/LayoutScreen';
import CustomText from 'components/CustomText/CustomText';
import IconArrow from '../../../../svgs/IconArrow';
import IconProducts from '../../../../svgs/IconProducts';
import IconExpenses from '../../../../svgs/IconExpenses';
import IconReceipts from '../../../../svgs/IconReceipts';
import ExpenseManagement from '../components/ExpenseManagement';
import ProductManagement from '../components/ProductManagement';
import ReceiptManagement from '../components/ReceiptManagement';

export default function StoreManagementScreen() {
  const router = useRouter();
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  const { currentStore } = useGlobalStore();
  const [activeTab, setActiveTab] = useState('products');

  const renderTabContent = () => {
    if (!storeId) return null;
    
    switch (activeTab) {
      case 'products':
        return <ProductManagement storeId={storeId} />;
      case 'expenses':
        return <ExpenseManagement storeId={storeId} />;
      case 'receipts':
        return <ReceiptManagement storeId={storeId} />;
      default:
        return <ProductManagement storeId={storeId} />;
    }
  };

  return (
    <LayoutScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconArrow width={20} height={20} />
        </TouchableOpacity>
        <CustomText style={styles.storeName}>
          {currentStore?.name || 'Tienda'}
        </CustomText>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <IconProducts width={24} height={24} />
          <CustomText>Productos</CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <IconExpenses width={24} height={24} />
          <CustomText>Gastos</CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'receipts' && styles.activeTab]}
          onPress={() => setActiveTab('receipts')}
        >
          <IconReceipts width={24} height={24} />
          <CustomText>Recibos</CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8a5cf6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
