import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import { ReceptionService } from '@flux/services/Receptions/ReceptionService';
import CustomText from '@components/CustomText/CustomText';
import Button from '@components/Buttons/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import IconArrow from '../../svgs/IconArrow';
import { IconCalendar } from '../../svgs/IconCalendar';
import CustomAlert from '@shared/components/CustomAlert';
import LogoPage from '@components/LogoPage/LogoPage';

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export default function ReceptionReportScreen() {
  const router = useRouter();
  const { currentStore } = useGlobalStore();
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { alertState, hideAlert, showError, showSuccess } = useGlobalStore()

  const handleGenerateReport = async () => {
    if (!currentStore?.id) {
      showError('No hay una tienda seleccionad. Prueba a seleccionar una primero!', { duration: 1000 })
      return;
    }
    
    const oneYearAgo = new Date(startDate.getTime() + ONE_YEAR_MS);
    if (endDate > oneYearAgo) {
      showError('El rango de fechas no puede ser mayor a 1 año', { duration: 2000 })
      return;
    }

    try {
      setLoading(true);
      const { data: reportData, error } = await ReceptionService.generateReport(
        currentStore.id,
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      if (error) {
        throw new Error(error);
      }
      
      showSuccess('Se ha generador el reporte correctamente!', 
        {
          icon: 'success', duration: 1000 
        }
      );
      console.log(reportData)
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al generar el reporte';
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
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingTop: 20 }}>
          <LogoPage />

          <CustomText style={styles.sectionTitle}>Creación de reporte</CustomText>
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

        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Opciones del Reporte</CustomText>
          
          <CustomText>Empty so far</CustomText>
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
  backButton: {
    padding: 8,
    marginLeft: 8,
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#5E24FF',
    backgroundColor: '#5E24FF',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  optionText: {
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
