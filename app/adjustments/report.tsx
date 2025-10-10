import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Sharing from 'expo-sharing';
import { cacheDirectory, EncodingType, writeAsStringAsync } from 'expo-file-system/legacy';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { AdjustmentService } from '@flux/services/Adjustments/AdjustmentService';
import CustomText from '@components/CustomText/CustomText';
import Button from '@components/Buttons/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconCalendar } from '../../svgs/IconCalendar';
import LogoPage from '@components/LogoPage/LogoPage';
import CustomAlert from '@shared/components/CustomAlert';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(blob);
  });
};

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export default function AdjustReport() {
  const { currentStore, showError, showSuccess, alertState, hideAlert } = useGlobalStore();
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!currentStore?.id) {
      showError('No hay una tienda seleccionada. Prueba a seleccionar una primero!', { duration: 1000 });
      return;
    }
    
    const oneYearAgo = new Date(startDate.getTime() + ONE_YEAR_MS);
    if (endDate > oneYearAgo) {
      showError('El rango de fechas no puede ser mayor a 1 año', { duration: 2000 });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await AdjustmentService.generateAdjustmentRangeReport(
        currentStore.id,
        startDate.toISOString(),
        endDate.toISOString()
      );

      
      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error('No se recibieron datos del reporte.');
      }

      const formatForFilename = (date: Date) => format(date, 'yyyyMMdd');
      const fileName = `reporte_ajustes_${formatForFilename(startDate)}-${formatForFilename(endDate)}.pdf`;
      const fileUri = `${cacheDirectory}${fileName}`;
      
      const base64Data = await blobToBase64(data);
      await writeAsStringAsync(fileUri, base64Data, {
        encoding: EncodingType.Base64,
      });

      if (!(await Sharing.isAvailableAsync())) {
        showError('La función de compartir no está disponible en este dispositivo!', { icon: 'error', duration: 2000 });
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte de ajustes',
        UTI: 'com.adobe.pdf',
      });
      
      showSuccess('¡Se ha generado el reporte de ajustes correctamente!', {
        icon: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error generating or sharing report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al generar o compartir el reporte';
      showError(errorMessage, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  const onStartDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  }, []);

  const onEndDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    } 
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <LogoPage />
            <CustomText style={styles.sectionTitle}>Reporte de Ajustes</CustomText>
          </View>

          <View style={styles.section}>
            <View style={styles.dateInputContainer}>
              <CustomText style={styles.label}>Fecha de Inicio</CustomText>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <IconCalendar width={20} height={20} fill="#666" />
                <CustomText style={styles.dateText}>{formatDate(startDate)}</CustomText>
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.dateInputContainer}>
              <CustomText style={styles.label}>Fecha de Fin</CustomText>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <IconCalendar width={20} height={20} fill="#666" />
                <CustomText style={styles.dateText}>{formatDate(endDate)}</CustomText>
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                  maximumDate={new Date()}
                  minimumDate={startDate}
                />
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Generar Reporte"
            onPress={handleGenerateReport}
            loading={loading}
            disabled={loading}
            style={styles.generateButton}
          />
        </View>
      </SafeAreaView>
      
      <CustomAlert {...alertState} onClose={hideAlert}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 20,
    marginBottom: 16,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#1a1a1a',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  generateButton: {
    width: '100%',
  },
});