// React and React Native
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  TextInputChangeEventData, 
  NativeSyntheticEvent 
} from 'react-native';

// Third-party libraries
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Types
import { Receipt } from '../../../types/store';

// Components
import CustomText from '../../../../components/CustomText/CustomText';
import Button from '../../../../components/Buttons/Button';

interface ReceiptFormProps {
  initialData?: Receipt | null;
  onSave: (data: Omit<Receipt, 'id'>) => void;
  onCancel: () => void;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ initialData, onSave, onCancel }) => {
  // Define payment method type
  type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

  const [formData, setFormData] = useState<Omit<Receipt, 'id'>>({
    receiptNumber: '',
    providerName: '',
    date: new Date().toISOString(),
    subtotal: 0,
    tax: 0,
    total: 0,
    paymentMethod: 'efectivo',
    notes: '',
    storeId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  useEffect(() => {
    // Calculate total when subtotal or tax changes
    const subtotal = Number(formData.subtotal) || 0;
    const tax = Number(formData.tax) || 0;
    const total = subtotal + (subtotal * (tax / 100));
    
    setFormData(prev => ({
      ...prev,
      total: Number(total.toFixed(2))
    }));
  }, [formData.subtotal, formData.tax]);

  const handleChange = (field: keyof typeof formData, value: string | number | NativeSyntheticEvent<TextInputChangeEventData>) => {
    // Handle case where value is an event object from TextInput
    const stringValue = typeof value === 'object' && value?.nativeEvent?.text !== undefined 
      ? value.nativeEvent.text 
      : String(value);

    // Handle numeric fields
    // Handle numeric fields
    if (field === 'subtotal' || field === 'tax' || field === 'total') {
      const numValue = parseFloat(stringValue.replace(/[^0-9.]/g, ''));
      
      if (!isNaN(numValue)) {
        setFormData(prev => ({
          ...prev,
          [field]: numValue
        }));
      }
    } else {
      // Handle string fields
      setFormData(prev => ({
        ...prev,
        [field]: stringValue
      }));
    }
  };

  // Define DateTimePicker event type
  type DateTimePickerEvent = {
    type: string;
    nativeEvent: {
      timestamp: number;
    };
  };

  const handleDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString()
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.providerName) {
      Alert.alert('Error', 'El nombre del proveedor es obligatorio');
      return;
    }
    if (formData.subtotal <= 0) {
      Alert.alert('Error', 'El subtotal debe ser mayor a 0');
      return;
    }
    onSave(formData);
  };

  const formattedDate = format(new Date(formData.date), 'PPP', { locale: es });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Número de recibo</CustomText>
        <TextInput
          style={styles.input}
          value={formData.receiptNumber}
          onChangeText={(text) => handleChange('receiptNumber', text)}
          placeholder="Número de factura o recibo"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Proveedor*</CustomText>
        <TextInput
          style={styles.input}
          value={formData.providerName}
          onChangeText={(text) => handleChange('providerName', text)}
          placeholder="Nombre del proveedor"
        />
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Fecha*</CustomText>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <CustomText>{formattedDate}</CustomText>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.date)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            locale="es-ES"
          />
        )}
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Subtotal</CustomText>
          <View style={styles.currencyInput}>
            <CustomText style={styles.currencySymbol}>$</CustomText>
            <TextInput
              style={[styles.input, { paddingLeft: 20 }]}
              value={formData.subtotal ? formData.subtotal.toString() : ''}
              onChangeText={(text) => handleChange('subtotal', text)}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>IVA/Impuesto (%)</CustomText>
          <View style={styles.percentageInput}>
            <TextInput
              style={[styles.input, { textAlign: 'right' }]}
              value={formData.tax ? formData.tax.toString() : ''}
              onChangeText={(text) => handleChange('tax', text)}
              placeholder="0"
              keyboardType="numeric"
            />
            <CustomText style={styles.percentageSymbol}>%</CustomText>
          </View>
        </View>
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Total</CustomText>
        <View style={[styles.currencyInput, styles.totalInput]}>
          <CustomText style={styles.currencySymbol}>$</CustomText>
          <CustomText style={styles.totalText}>
            {formData.total.toFixed(2)}
          </CustomText>
        </View>
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Método de pago</CustomText>
        <View style={styles.paymentMethodContainer}>
          {['efectivo', 'tarjeta', 'transferencia'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentMethodButton,
                formData.paymentMethod === method && styles.paymentMethodButtonActive
              ]}
              onPress={() => handleChange('paymentMethod', method)}
            >
              <CustomText 
                style={[
                  styles.paymentMethodText,
                  formData.paymentMethod === method ? styles.paymentMethodTextActive : {}
                ]}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Notas</CustomText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => handleChange('notes', text)}
          placeholder="Notas adicionales"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button  
          title="Cancelar" 
          onPress={onCancel} 
          style={[styles.button, styles.cancelButton]}
        />
        <Button 
          title={initialData ? 'Actualizar' : 'Guardar'} 
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  currencyInput: {
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
    fontSize: 16,
    color: '#666',
  },
  percentageInput: {
    position: 'relative',
  },
  percentageSymbol: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 16,
    color: '#666',
  },
  totalInput: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
    marginLeft: 20,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paymentMethodButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  paymentMethodButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  paymentMethodText: {
    color: '#666',
    fontSize: 14,
  },
  paymentMethodTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 8,
  },
});

export default ReceiptForm;
