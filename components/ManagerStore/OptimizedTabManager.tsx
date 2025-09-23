import React, { useState, useCallback, Suspense } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { TABS_CONFIG } from './TabConfig';
import OptimizedTabBar from './OptimizedTabBar';
import { useOptimizedTabs } from '@hooks/useOptimizedTabs';

interface OptimizedTabManagerProps {
  initialTab?: string;
}

export default function OptimizedTabManager({ initialTab = 'products' }: OptimizedTabManagerProps) {
  const { activeTab, isSwitching, getTabComponent } = useOptimizedTabs(initialTab);
  const [mountedComponents, setMountedComponents] = useState<Set<string>>(new Set([initialTab]));

  // Manejar cambio de tab
  const handleTabChange = useCallback((tabId: string) => {
    // Marcar el componente como montado
    setMountedComponents(prev => new Set(prev).add(tabId));
  }, []);

  // Componente de carga para Suspense
  const LoadingFallback = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6A4DFF" />
      <CustomText style={styles.loadingText}>Cargando vista...</CustomText>
    </View>
  );

  // Componente de cambio de tab
  const TabSwitchingIndicator = () => (
    <View style={styles.switchingOverlay}>
      <View style={styles.switchingCard}>
        <ActivityIndicator size="small" color="#6A4DFF" />
        <CustomText style={styles.switchingText}>Cambiando de vista...</CustomText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* TabBar optimizada */}
      <OptimizedTabBar initialTab={initialTab} onTabChange={handleTabChange} />
      
      {/* Contenido del tab actual */}
      <View style={styles.contentContainer}>
        {isSwitching && <TabSwitchingIndicator />}
        
        <View style={[styles.tabContent, isSwitching && styles.tabContentBlurred]}>
          <Suspense fallback={<LoadingFallback />}>
            {renderActiveTab()}
          </Suspense>
        </View>
      </View>
    </View>
  );

  function renderActiveTab() {
    const ActiveComponent = getTabComponent(activeTab);
    if (!ActiveComponent) {
      return (
        <View style={styles.errorContainer}>
          <CustomText style={styles.errorText}>Componente no encontrado</CustomText>
        </View>
      );
    }
    
    return <ActiveComponent />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  tabContent: {
    flex: 1,
  },
  tabContentBlurred: {
    opacity: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6A4DFF',
    fontWeight: '500',
  },
  switchingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  switchingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  switchingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6A4DFF',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    fontWeight: '500',
  },
});
