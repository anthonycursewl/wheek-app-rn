import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import IconProducts from '@svgs/IconProducts';
import { IconCategories } from '@svgs/IconCategories';
import { IconProviders } from '@svgs/IconProviders';
import { IconInventory } from '@svgs/IconInventory';
import { IconReceptions } from '@svgs/IconReceptions';
import { IconMember } from '@svgs/IconMember';
import { IconCalendar } from '@svgs/IconCalendar';
import { IconDate } from '@svgs/IconDate';
import IconManage from '@svgs/IconManage';

export type SearchResultType = 'product' | 'category' | 'provider' | 'inventory' | 'reception' | 'member';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  metadata?: {
    quantity?: number;
    price?: number;
    status?: string;
    date?: string;
  };
}

interface SearchResultsCardProps {
  item: SearchResult;
  onPress: (item: SearchResult) => void;
}

export const SearchResultsCard: React.FC<SearchResultsCardProps> = ({ item, onPress }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'product':
        return <IconManage width={24} height={24} fill="rgba(155, 112, 255, 0.94)" />;
      case 'category':
        return <IconCategories width={24} height={24} fill="rgb(124, 77, 255)" />;
      case 'provider':
        return <IconProviders width={24} height={24} fill="rgb(251, 192, 45)" />;
      case 'inventory':
        return <IconInventory width={24} height={24} fill="rgb(255, 152, 0)" />;
      case 'reception':
        return <IconReceptions width={24} height={24} fill="rgb(76, 175, 80)" />;
      case 'member':
        return <IconMember width={24} height={24} fill="rgb(186, 104, 200)" />;
      default:
        return <IconProducts width={24} height={24} color="rgb(156, 39, 176)" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'product':
        return 'rgba(155, 112, 255, 0.12)';
      case 'category':
        return 'rgba(124, 77, 255, 0.19)';
      case 'provider':
        return 'rgba(251, 193, 45, 0.14)';
      case 'inventory':
        return 'rgba(255, 153, 0, 0.15)';
      case 'reception':
        return 'rgba(76, 175, 79, 0.14)';
      case 'member':
        return 'rgba(186, 104, 200, 0.1)';
      default:
        return 'rgba(155, 39, 176, 0.1)';
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'product':
        return 'Producto';
      case 'category':
        return 'Categoría';
      case 'provider':
        return 'Proveedor';
      case 'inventory':
        return 'Inventario';
      case 'reception':
        return 'Recepción';
      case 'member':
        return 'Miembro';
      default:
        return 'Item';
    }
  };

  const getLabelColor = () => {
    switch (item.type) {
      case 'product':
        return 'rgba(155, 112, 255)';
      case 'category':
        return 'rgb(124, 77, 255)';
      case 'provider':
        return 'rgba(251, 193, 45)';
      case 'inventory':
        return 'rgb(255, 152, 0)';
      case 'reception':
        return 'rgba(76, 175, 79)';
      case 'member':
        return 'rgba(186, 104, 200)';
      default:
        return 'rgba(155, 39, 176)';
    }
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('activo') || statusLower.includes('completada') || statusLower.includes('actualizado')) {
      return 'rgba(76, 175, 80, 0.12)';
    }
    if (statusLower.includes('inactivo') || statusLower.includes('pendiente')) {
      return 'rgba(255, 152, 0, 0.12)';
    }
    return 'rgba(158, 158, 158, 0.12)';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      {/* Icono con fondo circular moderno */}
      <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor()}15` }]}>
        {getIcon()}
      </View>
      
      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        {/* Header con título y badge */}
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.typeBadge, { borderColor: getLabelColor() }]}>
            <CustomText style={[styles.typeText, { color: getLabelColor() }]}>
              {getTypeLabel()}
            </CustomText>
          </View>
        </View>
        
        {/* Subtítulo si existe */}
        {item.subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        )}
        
        {/* Descripción con estilo mejorado */}
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        {/* Metadatos con diseño de chips modernos e iconos informativos */}
        {item.metadata && (
          <View style={styles.metadataContainer}>
            {item.metadata.quantity !== undefined && (
              <View style={[styles.metadataChip, { backgroundColor: `${getTypeColor()}08` }]}>
                <View style={styles.chipIconContainer}>
                  <IconProducts width={12} height={12} color={getLabelColor()} />
                </View>
                <CustomText style={[styles.metadataChipText, { color: getLabelColor() }]}>
                  {item.metadata.quantity} unid
                </CustomText>
              </View>
            )}
            {item.metadata.price !== undefined && (
              <View style={[styles.metadataChip, { backgroundColor: `${getTypeColor()}08` }]}>
                <View style={styles.chipIconContainer}>
                  <Text style={[styles.priceIcon, { color: getLabelColor() }]}>$</Text>
                </View>
                <CustomText style={[styles.metadataChipText, { color: getLabelColor() }]}>
                  {item.metadata.price.toFixed(2)}
                </CustomText>
              </View>
            )}
            {item.metadata.status && (
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(item.metadata.status) }]}>
                <View style={styles.chipIconContainer}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.metadata.status).replace('0.12', '1') }]} />
                </View>
                <CustomText style={styles.statusChipText}>
                  {item.metadata.status}
                </CustomText>
              </View>
            )}
            {item.metadata.date && (
              <View style={styles.metadataChip}>
                <View style={styles.chipIconContainer}>
                  <IconCalendar width={12} height={12} color="rgb(117, 117, 117)" />
                </View>
                <CustomText style={styles.metadataChipText}>
                  {formatDate(item.metadata.date)}
                </CustomText>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Contenedor principal con diseño moderno
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Contenedor del icono con diseño circular moderno
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  
  // Contenedor del contenido
  contentContainer: {
    flex: 1,
  },
  
  // Header con título y badge
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  // Estilos de texto
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: 'rgb(33, 33, 33)',
    flex: 1,
    marginRight: 8,
    fontFamily: 'Onest-Regular',
  },
  
  // Badge de tipo
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  
  typeText: {
    fontSize: 11,
    fontWeight: '500' as const,
    fontFamily: 'Onest-Regular',
  },
  
  // Subtítulo
  subtitle: {
    fontSize: 14,
    color: 'rgb(117, 117, 117)',
    marginBottom: 6,
    fontFamily: 'Onest-Regular',
  },
  
  // Descripción
  description: {
    fontSize: 13,
    color: 'rgb(158, 158, 158)',
    marginBottom: 10,
    lineHeight: 18,
    fontFamily: 'Onest-Regular',
  },
  
  // Contenedor de metadatos
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  
  // Chips de metadatos con diseño moderno
  metadataChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  
  metadataChipText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: 'rgb(117, 117, 117)',
    fontFamily: 'Onest-Regular',
  },
  
  // Chip de estado con colores dinámicos
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: 'rgb(33, 33, 33)',
    fontFamily: 'Onest-Regular',
  },
  
  // Contenedor para iconos dentro de los chips
  chipIconContainer: {
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Icono de precio personalizado
  priceIcon: {
    fontSize: 10,
    fontWeight: '600' as const,
    fontFamily: 'Onest-Regular',
  },
  
  // Punto de estado
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default SearchResultsCard;
