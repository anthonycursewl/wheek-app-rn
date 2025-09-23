import { useState, useCallback, useEffect } from 'react';
import { TABS_CONFIG } from '@components/ManagerStore/TabConfig';

interface UseOptimizedTabsReturn {
  activeTab: string;
  isSwitching: boolean;
  loadedTabs: Set<string>;
  switchTab: (tabId: string) => void;
  preloadTab: (tabId: string) => void;
  getTabComponent: (tabId: string) => React.ComponentType | null;
}

export function useOptimizedTabs(initialTab: string = 'products'): UseOptimizedTabsReturn {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSwitching, setIsSwitching] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set([initialTab]));
  const [componentCache, setComponentCache] = useState<Record<string, React.ComponentType>>({});

  // Precargar componente de un tab específico
  const preloadTab = useCallback((tabId: string) => {
    if (loadedTabs.has(tabId)) return;
    
    const tabConfig = TABS_CONFIG.find(tab => tab.id === tabId);
    if (tabConfig) {
      // Simular carga asíncrona del componente
      setTimeout(() => {
        setComponentCache(prev => ({
          ...prev,
          [tabId]: tabConfig.Component
        }));
        setLoadedTabs(prev => new Set(prev).add(tabId));
      }, 0);
    }
  }, [loadedTabs]);

  // Precargar tabs adyacentes para mejor rendimiento
  useEffect(() => {
    const currentIndex = TABS_CONFIG.findIndex(tab => tab.id === activeTab);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : -1;
    const nextIndex = currentIndex < TABS_CONFIG.length - 1 ? currentIndex + 1 : -1;

    // Precargar tab anterior
    if (previousIndex !== -1) {
      preloadTab(TABS_CONFIG[previousIndex].id);
    }

    // Precargar siguiente tab
    if (nextIndex !== -1) {
      preloadTab(TABS_CONFIG[nextIndex].id);
    }
  }, [activeTab, preloadTab]);

  // Cambiar de tab con animación suave
  const switchTab = useCallback((tabId: string) => {
    if (tabId === activeTab || isSwitching) return;
    
    setIsSwitching(true);
    
    // Precargar el tab si no está cargado
    if (!loadedTabs.has(tabId)) {
      preloadTab(tabId);
    }
    
    // Simular transición suave
    setTimeout(() => {
      setActiveTab(tabId);
      
      // Pequeña demora para que la transición sea visible
      setTimeout(() => {
        setIsSwitching(false);
      }, 150);
    }, 100);
  }, [activeTab, isSwitching, loadedTabs, preloadTab]);

  // Obtener componente del tab
  const getTabComponent = useCallback((tabId: string) => {
    return componentCache[tabId] || null;
  }, [componentCache]);

  return {
    activeTab,
    isSwitching,
    loadedTabs,
    switchTab,
    preloadTab,
    getTabComponent,
  };
}
