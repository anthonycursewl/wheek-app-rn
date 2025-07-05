import { useLocalSearchParams } from 'expo-router';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import LayoutScreen from '@components/Layout/LayoutScreen';
import CustomText from '@components/CustomText/CustomText';
// components
import ProductManagement from '@components/dashboard/products/management/ProductManagement';
import CategoryManagement from '@components/dashboard/categories/management/CategoryManagement';

const colors = {
  primary: '#8a5cf5',
  background: '#f5f5f7',
  white: '#ffffff',
  gray: '#8e8e93',
  dark: '#1c1c1e',
  lightGray: '#e5e5ea',
};

import IconProducts from 'svgs/IconProducts';
import IconExpenses from 'svgs/IconExpenses';
import IconReceipts from 'svgs/IconReceipts';
import ProviderManagement from '@components/dashboard/providers/management/ProviderManagement';

const ExpenseManagement = () => (
  <View style={styles.tabContent}>
    <CustomText>Gestión de Gastos</CustomText>
  </View>
);

const ReceiptManagement = () => (
  <View style={styles.tabContent}>
    <CustomText>Gestión de Recibos</CustomText>
  </View>
);

type TabType = 'products' | 'expenses' | 'receipts' | 'categories' | 'providers';

export default function StoreManagementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentStore } = useGlobalStore();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'receipts':
        return <ReceiptManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'providers':
        return <ProviderManagement />;
      default:
        return <ProductManagement />;
    }
  };

  if (!currentStore) {
    return null;
  }

  return (
    <LayoutScreen>

      <View style={styles.header}>
        <View style={{ gap: 5 }}>
          <CustomText style={styles.storeName}>{currentStore.name}</CustomText>
          <CustomText style={styles.storeDescription}>
            {currentStore.description || 'Sin descripción'}
          </CustomText>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ gap: 15 }}
      >
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <IconProducts width={20} height={20} color={activeTab === 'products' ? colors.primary : colors.gray} />
          <CustomText style={[
            styles.tabText, 
            activeTab === 'products' ? styles.activeTabText : {}
          ] as any}>
            Productos
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
          onPress={() => setActiveTab('categories')}
        >
          <IconProducts width={20} height={20} color={activeTab === 'categories' ? colors.primary : colors.gray} />
          <CustomText style={[
            styles.tabText, 
            activeTab === 'categories' ? styles.activeTabText : {}
          ] as any}>
            Categorias
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'providers' && styles.activeTab]}
          onPress={() => setActiveTab('providers')}
        >
          <IconProducts width={20} height={20} color={activeTab === 'providers' ? colors.primary : colors.gray} />
          <CustomText style={[
            styles.tabText, 
            activeTab === 'providers' ? styles.activeTabText : {}
          ] as any}>
            Proveedores
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
          onPress={() => setActiveTab('expenses')}
        >
          <IconExpenses width={20} height={20} color={activeTab === 'expenses' ? colors.primary : colors.gray} />
          <CustomText style={[
            styles.tabText, 
            activeTab === 'expenses' ? styles.activeTabText : {}
          ] as any}>
            Gastos
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'receipts' && styles.activeTab]}
          onPress={() => setActiveTab('receipts')}
        >
          <IconReceipts width={20} height={20} color={activeTab === 'receipts' ? colors.primary : colors.gray} />
          <CustomText style={[
            styles.tabText, 
            activeTab === 'receipts' ? styles.activeTabText : {}
          ] as any}>
            Recibos
          </CustomText>
        </TouchableOpacity>
      </ScrollView>

      {renderTabContent()}
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.gray,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 10,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  storeDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 1.2,
    borderBottomColor: colors.primary,
    borderStyle: 'dashed',
  },
  tabText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContent: {
    padding: 16,
  },
});
