import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import IconSearch from '@svgs/IconSearch';

interface SearchEmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  searchQuery = '',
  hasFilters = false,
}) => {
  const getTitle = () => {
    if (searchQuery && hasFilters) {
      return 'No se encontraron resultados';
    } else if (searchQuery) {
      return 'No se encontraron resultados';
    } else if (hasFilters) {
      return 'No hay resultados con estos filtros';
    } else {
      return 'Comienza tu búsqueda';
    }
  };

  const getDescription = () => {
    if (searchQuery && hasFilters) {
      return `No encontramos resultados para "${searchQuery}" con los filtros aplicados. Intenta con otros términos o ajusta los filtros.`;
    } else if (searchQuery) {
      return `No encontramos resultados para "${searchQuery}". Intenta con otros términos de búsqueda.`;
    } else if (hasFilters) {
      return 'No hay resultados que coincidan con los filtros seleccionados. Intenta ajustar los filtros.';
    } else {
      return 'Busca productos, categorías, proveedores, inventario, recepciones o miembros del equipo.';
    }
  };

  const getSuggestions = () => {
    if (!searchQuery && !hasFilters) {
      return [
        'Escribe el nombre de un producto',
        'Busca por categoría o proveedor',
        'Filtra por tipo de contenido',
        'Usa palabras clave específicas'
      ];
    }
    return [];
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSearch width={48} height={48} fill="rgba(165, 132, 255, 0.3)" />
      </View>
      
      <CustomText style={styles.title}>
        {getTitle()}
      </CustomText>
      
      <CustomText style={styles.description}>
        {getDescription()}
      </CustomText>
      
      {getSuggestions().length > 0 && (
        <View style={styles.suggestionsContainer}>
          <CustomText style={styles.suggestionsTitle}>
            Sugerencias:
          </CustomText>
          {getSuggestions().map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <CustomText style={styles.suggestionText}>
                • {suggestion}
              </CustomText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(165, 132, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgb(33, 33, 33)',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgb(117, 117, 117)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: 'rgba(165, 132, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(165, 132, 255, 0.2)',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(165, 132, 255)',
    marginBottom: 12,
  },
  suggestionItem: {
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: 'rgb(117, 117, 117)',
    lineHeight: 20,
  },
});
