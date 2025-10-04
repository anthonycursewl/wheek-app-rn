import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import LayoutScreen from '@components/Layout/LayoutScreen';
import { SearchHeader } from './components/SearchHeader';
import { SearchResultsCard, SearchResult, SearchResultType } from './components/SearchResultsCard';
import { SearchEmptyState } from './components/SearchEmptyState';
import { SearchLoadingState } from './components/SearchLoadingState';
import { FilterModal } from 'shared/components/FilterModal';
import { useFilters } from 'hooks/useFilter';
import { searchFilterConfig, initialSearchFilters } from './components/searchFilterConfig';

// Datos de ejemplo para la búsqueda
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'product',
    title: 'Camiseta Premium',
    subtitle: 'Ropa',
    description: 'Camiseta de alta calidad con diseño moderno y tejido transpirable.',
    metadata: {
      quantity: 25,
      price: 29.99,
      status: 'Activo'
    }
  },
  {
    id: '2',
    type: 'category',
    title: 'Electrónicos',
    description: 'Categoría de productos electrónicos y accesorios tecnológicos.',
    metadata: {
      quantity: 150,
      status: 'Activa'
    }
  },
  {
    id: '3',
    type: 'provider',
    title: 'TechPro Solutions',
    subtitle: 'Proveedor de tecnología',
    description: 'Proveedor especializado en productos electrónicos y soluciones tecnológicas.',
    metadata: {
      date: '2024-01-15',
      status: 'Activo'
    }
  },
  {
    id: '4',
    type: 'inventory',
    title: 'Inventario Principal',
    subtitle: 'Almacén Central',
    description: 'Inventario principal con todos los productos disponibles para venta.',
    metadata: {
      quantity: 1250,
      status: 'Actualizado'
    }
  },
  {
    id: '5',
    type: 'reception',
    title: 'Recepción #001',
    subtitle: 'TechPro Solutions',
    description: 'Recepción de productos electrónicos del proveedor TechPro Solutions.',
    metadata: {
      quantity: 50,
      date: '2024-01-20',
      status: 'Completada'
    }
  },
  {
    id: '6',
    type: 'member',
    title: 'Juan Pérez',
    subtitle: 'Administrador',
    description: 'Miembro del equipo con rol de administrador y acceso completo.',
    metadata: {
      date: '2024-01-10',
      status: 'Activo'
    }
  },
];

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    filters,
    setFilters,
    showFilters,
    openFilterModal,
    closeFilterModal,
    queryParams,
  } = useFilters(initialSearchFilters);

  // Check if any filters are active
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    // Skip the default relevance filter
    if (key === 'relevance') return false;
    
    // Check date range filter
    if (key === 'dateRange' && typeof value === 'object' && value !== null) {
      const dateRange = value as { startDate: Date | null; endDate: Date | null };
      return dateRange.startDate !== null || dateRange.endDate !== null;
    }
    
    // Check boolean filters
    return typeof value === 'boolean' && value === true;
  });

  // Simular búsqueda de datos
  const performSearch = useCallback(async (query: string, isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true);
    }
    
    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrar resultados basados en la consulta
      let filteredResults = mockSearchResults;
      
      if (query.trim()) {
        filteredResults = mockSearchResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Aplicar filtros de tipo
      const activeTypes = Object.entries(filters)
        .filter(([key, value]) => 
          ['products', 'categories', 'providers', 'inventory', 'receptions', 'members'].includes(key) && 
          value === true
        )
        .map(([key]) => key.slice(0, -1)); // Remove 's' from plural
      
      if (activeTypes.length > 0) {
        filteredResults = filteredResults.filter(item => 
          activeTypes.includes(item.type)
        );
      }
      
      // Aplicar filtros de estado
      if (filters.active && !filters.inactive) {
        filteredResults = filteredResults.filter(item => 
          item.metadata?.status?.toLowerCase().includes('activo')
        );
      }
      
      if (filters.inactive && !filters.active) {
        filteredResults = filteredResults.filter(item => 
          item.metadata?.status?.toLowerCase().includes('inactivo')
        );
      }
      
      if (filters.deleted) {
      }
      
      // Aplicar ordenamiento
      if (filters.asc) {
        filteredResults.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filters.desc) {
        filteredResults.sort((a, b) => b.title.localeCompare(a.title));
      } else if (filters.newest) {
        filteredResults.sort((a, b) => {
          const dateA = a.metadata?.date ? new Date(a.metadata.date).getTime() : 0;
          const dateB = b.metadata?.date ? new Date(b.metadata.date).getTime() : 0;
          return dateB - dateA;
        });
      } else if (filters.oldest) {
        filteredResults.sort((a, b) => {
          const dateA = a.metadata?.date ? new Date(a.metadata.date).getTime() : 0;
          const dateB = b.metadata?.date ? new Date(b.metadata.date).getTime() : 0;
          return dateA - dateB;
        });
      }
      
      setSearchResults(filteredResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  // Efecto para realizar búsqueda cuando cambian los filtros o la consulta
  useEffect(() => {
    if (searchQuery.trim() || Object.values(filters).some(value => value === true)) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery, filters, performSearch]);

  // Manejar pull-to-refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    performSearch(searchQuery, true);
  }, [searchQuery, performSearch]);

  // Manejar presión en un resultado
  const handleResultPress = useCallback((item: SearchResult) => {
    console.log('Presionado:', item.title, item.type);
    // Aquí se podría navegar a la pantalla de detalles correspondiente
  }, []);

  // Renderizar item de la lista
  const renderItem = useCallback(({ item }: { item: SearchResult }) => (
    <SearchResultsCard
      item={item}
      onPress={handleResultPress}
    />
  ), [handleResultPress]);

  // Renderizar lista vacía
  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return <SearchLoadingState />;
    }
    
    if (!hasSearched) {
      return (
        <SearchEmptyState
          searchQuery=""
          hasFilters={false}
        />
      );
    }
    
    return (
      <SearchEmptyState
        searchQuery={searchQuery}
        hasFilters={hasActiveFilters}
      />
    );
  }, [isLoading, hasSearched, searchQuery, hasActiveFilters]);

  return (
    <LayoutScreen>
      <View style={styles.container}>
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterPress={openFilterModal}
          placeholder="Buscar productos, categorías, proveedores..."
        />
        
        {/* flatlist to manage searchs by applying filters and search terms */}
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ height: '100%' }}
          contentContainerStyle={{ paddingTop: 5, paddingBottom: 15 }} 
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="rgb(165, 132, 255)"
              colors={['rgb(165, 132, 255)']}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
        
        <FilterModal
          visible={showFilters}
          onClose={closeFilterModal}
          filterConfig={searchFilterConfig}
          appliedFilters={filters}
          onFiltersChange={setFilters}
        />
      </View>
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
