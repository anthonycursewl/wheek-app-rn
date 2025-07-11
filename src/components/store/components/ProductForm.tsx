import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { Product } from '@/types/store';
import CustomText from '@/components/CustomText/CustomText';
import CustomButton from '@/components/Button/Button';

interface ProductFormProps {
  initialData?: Product | null;
  onSave: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    code: '',
    barcode: '',
    stock: 0,
    unit: 'un',
    category: '',
    storeId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'cost' || field === 'stock' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      Alert.alert('Error', 'El nombre del producto es obligatorio');
      return;
    }
    if (formData.price <= 0) {
      Alert.alert('Error', 'El precio debe ser mayor a 0');
      return;
    }
    onSave(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Nombre del producto*</CustomText>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Ej: Camiseta blanca"
        />
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Descripción</CustomText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Descripción del producto"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Precio de venta*</CustomText>
          <View style={styles.currencyInput}>
            <CustomText style={styles.currencySymbol}>$</CustomText>
            <TextInput
              style={[styles.input, { paddingLeft: 20 }]}
              value={formData.price ? formData.price.toString() : ''}
              onChangeText={(text) => handleChange('price', text.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Costo</CustomText>
          <View style={styles.currencyInput}>
            <CustomText style={styles.currencySymbol}>$</CustomText>
            <TextInput
              style={[styles.input, { paddingLeft: 20 }]}
              value={formData.cost ? formData.cost.toString() : ''}
              onChangeText={(text) => handleChange('cost', text.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Código</CustomText>
          <TextInput
            style={styles.input}
            value={formData.code}
            onChangeText={(text) => handleChange('code', text)}
            placeholder="Código interno"
          />
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Código de barras</CustomText>
          <TextInput
            style={styles.input}
            value={formData.barcode}
            onChangeText={(text) => handleChange('barcode', text)}
            placeholder="Código de barras"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Stock</CustomText>
          <TextInput
            style={styles.input}
            value={formData.stock ? formData.stock.toString() : ''}
            onChangeText={(text) => handleChange('stock', text.replace(/[^0-9]/g, ''))}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <CustomText style={styles.label}>Unidad</CustomText>
          <TextInput
            style={styles.input}
            value={formData.unit}
            onChangeText={(text) => handleChange('unit', text)}
            placeholder="un, kg, l, etc."
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <CustomText style={styles.label}>Categoría</CustomText>
        <TextInput
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => handleChange('category', text)}
          placeholder="Categoría del producto"
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton 
          title="Cancelar" 
          onPress={onCancel} 
          variant="outline"
          style={[styles.button, styles.cancelButton]}
        />
        <CustomButton 
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

export default ProductForm;
