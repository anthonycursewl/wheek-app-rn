import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { TABS_CONFIG } from './TabConfig';

interface OptimizedTabViewProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function OptimizedTabView({ activeTab, onTabChange }: OptimizedTabViewProps) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<React.ComponentType | null>(null);
  const [loadedComponents, setLoadedComponents] = useState<Record<string, React.ComponentType>>({});

  // Precargar componentes en segundo plano
  const preloadComponents = useCallback(() => {
    TABS_CONFIG.forEach(tab => {
      if (!loadedComponents[tab.id]) {
        // Simular carga asíncrona del componente
        setTimeout(() => {
          setLoadedComponents(prev => ({
            ...prev,
            [tab.id]: tab.Component
          }));
        }, 0);
      }
    });
  }, [loadedComponents]);

  useEffect(() => {
    preloadComponents();
  }, [preloadComponents]);

  // Manejar cambio de tab con indicador de carga
  const handleTabChange = useCallback((tabId: string) => {
    if (tabId === activeTab) return;
    
    setIsSwitching(true);
    
    // Mostrar indicador de carga por un tiempo mínimo para mejor UX
    setTimeout(() => {
      const targetTab = TABS_CONFIG.find(tab => tab.id === tabId);
      if (targetTab) {
        setCurrentComponent(() => targetTab.Component);
        onTabChange(tabId);
      }
      
      // Ocultar indicador de carga
      setTimeout(() => {
        setIsSwitching(false);
      }, 150);
    }, 100);
  }, [activeTab, onTabChange]);

  // Establecer componente inicial
  useEffect(() => {
    const initialTab = TABS_CONFIG.find(tab => tab.id === activeTab);
    if (initialTab && !currentComponent) {
      setCurrentComponent(() => initialTab.Component);
    }
  }, [activeTab, currentComponent]);

  return (
    <View style={styles.container}>
      {/* Indicador de carga durante cambio de tab */}
      {isSwitching && (
        <View style={styles.switchingOverlay}>
          <View style={styles.switchingContent}>
            <ActivityIndicator size="small" color="#6A4DFF" />
            <CustomText style={styles.switchingText}>Cambiando vista...</CustomText>
          </View>
        </View>
      )}
      
      {/* Renderizar el componente actual */}
      <View style={[styles.contentContainer, isSwitching && styles.contentBlurred]}>
        {currentComponent && (
          <React.Suspense fallback={
            <View style={styles.fallbackContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <CustomText style={styles.fallbackText}>Cargando componente...</CustomText>
            </View>
          }>
            {React.createElement(currentComponent)}
          </React.Suspense>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
  },
  contentBlurred: {
    opacity: 0.3,
  },
  switchingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  switchingContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6A4DFF',
    fontWeight: '500',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  fallbackText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
