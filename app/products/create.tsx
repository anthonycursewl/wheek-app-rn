// components
import CustomText from "@/components/CustomText/CustomText";
import Input from "@/components/Input/Input";
import Button from "@/components/Buttons/Button";
import LogoPage from "@/components/LogoPage/LogoPage";
// layout
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { View, Alert } from "react-native";
import { useState } from "react";


interface FormData {
  name: string;
  description: string;
  category: string;
}

export default function CreateProduct() {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: ''
  });

  // Manejar cambios en los inputs
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.category) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    try {
      // Limpiar el formulario después de agregar
      setFormData({
        name: '',
        description: '',
        category: ''
      });
      Alert.alert('Éxito', 'Producto creado correctamente');
    } catch (err) {
    }
  };

  return (
    <LayoutScreen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
        <LogoPage />
        <CustomText>Crear Producto</CustomText>
      </View>

      <View style={{ width: '100%', marginTop: 30, gap: 20 }}>
        <View style={{ width: '100%', gap: 8 }}>
          <CustomText style={{ fontSize: 18 }}>Nombre del Producto</CustomText>
          <Input 
            placeholder="Nombre del Producto"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>

        <View style={{ width: '100%', gap: 8 }}>
          <CustomText style={{ fontSize: 18 }}>Descripción del Producto</CustomText>
          <Input 
            placeholder="Descripción del Producto..." 
            multiline={true} 
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
          />
        </View>

        <View style={{ width: '100%', gap: 8 }}>
          <CustomText style={{ fontSize: 18 }}>Categoría</CustomText>
          <Input 
            placeholder="Elije una categoría..."
            value={formData.category}
            onChangeText={(text) => handleChange('category', text)}
          />
        </View>
      </View>

      <View style={{ width: '100%', marginTop: 30, flex: 1, justifyContent: 'flex-end' }}>
        <Button 
          title={'Crear Producto'} 
          variant='primary' 
          onPress={handleSubmit}
          disabled={false}
        />
      </View>
    </LayoutScreen>
  );
}

