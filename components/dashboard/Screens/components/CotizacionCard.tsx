import { Cotizacion } from "@flux/stores/useGlobalStore";
import { View, Image, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { IconSuccess } from "svgs/IconSuccess";

const wheekLogo = require('@assets/images/wheek/wheek.png');

/**
 * Formatea un número a un string de moneda.
 * @param value - El número a formatear.
 * @returns Un string formateado como "Bs. 1.234,56" o "No disponible".
 */
const formatCurrency = (value: number | null): string => {
  if (value === null || typeof value === 'undefined') {
    return 'No disponible';
  }
  return `Bs. ${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

/**
 * Formatea una fecha ISO a una hora legible.
 * @param isoDateString - La fecha en formato ISO.
 * @returns Un string como "Actualizado a las 15:05".
 */
const formatRelativeTime = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `Actualizado a las ${hours}:${minutes}`;
};

const getAccentColor = (fuente: string): string => {
  switch (fuente) {
    case 'oficial':
      return '#4A90E2'
    case 'paralelo':
      return '#50E3C2'
    case 'bitcoin':
      return '#F5A623'
    default:
      return '#D8D8D8'
  }
};

export const CotizacionCard = ({ cotizacion }: { cotizacion: Cotizacion }) => {
  const accentColor = getAccentColor(cotizacion.fuente);

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.cardHeader}>
        <CustomText style={styles.cardTitle}>{cotizacion.nombre}</CustomText>
        <CustomText style={styles.cardTimestamp}>
          {formatRelativeTime(cotizacion.fechaActualizacion)}
        </CustomText>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-start', width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CustomText style={{ fontSize: 12 }}>Verificado por </CustomText>
            <Image source={wheekLogo} style={{ width: 40, height: 20 }} resizeMode="contain" />
          </View> 
          <IconSuccess width={16} height={16} fill={'rgb(170, 125, 241)'} />
        </View>
      </View>

      <View style={styles.averageContainer}>
        <CustomText style={styles.averageText}>
          {formatCurrency(cotizacion.promedio)}
        </CustomText>
        <CustomText style={styles.averageLabel}>Promedio | USD</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

    card: {
        backgroundColor: '#F7F7F7',
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 5,
  },
  cardHeader: {
      alignItems: 'flex-start',
      paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  averageContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
  },
  averageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  averageLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
},
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
},
detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
      fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  detailValue: {
      fontSize: 16,
    fontWeight: '500',
    color: '#333',
  }
})