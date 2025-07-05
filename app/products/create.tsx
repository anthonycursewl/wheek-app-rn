// components
import CustomText from "@components/CustomText/CustomText";
import Input from "@components/Input/Input";
import Button from "@components/Buttons/Button";
import LogoPage from "@components/LogoPage/LogoPage";
// layout
import LayoutScreen from "@components/Layout/LayoutScreen";
// React Native
import { View, Alert, ScrollView, Switch, TouchableOpacity, StyleSheet, Animated, Platform } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect, useRef } from "react";
// Icons
import { MaterialIcons } from "@expo/vector-icons";
// Expo Libraries
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { useAudioPlayer } from "expo-audio";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useShopStore } from "@flux/stores/useShopStore";
import { generateEAN13 } from "shared/services/generateEAN13";
import { FormProductData } from "shared/interfaces/ProductFormData";

const audioSource = require('@assets/sounds/beep_barcode.mp3');

export default function CreateProduct() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const player = useAudioPlayer(audioSource);
  const { currentStore } = useGlobalStore();
  const { stores, dispatch } = useShopStore();
  const [storesList, setStoresList] = useState<{label: string, value: string}[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>(currentStore?.id || '');

  const [formData, setFormData] = useState<FormProductData>({
    name: '',
    barcode: '',
    store_id: currentStore?.id || '',
    ficha: {
      condition: 'nuevo',
      cost: '',
      benchmark: '',
      tax: false,
    },
    category: ''
  });

  useEffect(() => {
    const loadStores = async () => {
      try {
        if (stores.length > 0) {
          setStoresList(stores.map(store => ({
            label: store.name,
            value: store.id
          })));
        }
      } catch (error) {
        console.error('Error loading stores:', error);
      }
    };

    loadStores();
  }, [stores]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      store_id: selectedStore
    }));
  }, [selectedStore]);

  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (showScanner) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnimation, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnimation, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [showScanner]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (scanningResult.data) {
      player.seekTo(0);
      player.play();

      console.log(`Código escaneado -> Tipo: ${scanningResult.type}, Dato: ${scanningResult.data}`);
      setScanned(true);
      setShowScanner(false);
      handleChange('barcode', scanningResult.data);
    }
  };

  const startBarcodeScanner = () => {
    setScanned(false);
    setShowScanner(true);
  };

  const handleGenerateEAN13 = () => {
    const ean13 = generateEAN13();
    if (ean13) {
      handleChange('barcode', ean13);
    }
  };

  const handleChange = (field: keyof FormProductData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFichaChange = (field: keyof FormProductData['ficha'], value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      ficha: { ...prev.ficha, [field]: value }
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.barcode || !formData.store_id || !formData.category || !formData.ficha.condition || !formData.ficha.cost || !formData.ficha.benchmark) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }
    try {
      console.log('Datos del producto a enviar:', {
        ...formData,
        ficha: { ...formData.ficha, cost: parseFloat(formData.ficha.cost), benchmark: parseFloat(formData.ficha.benchmark) }
      });
      setFormData({
        name: '', barcode: '', store_id: '',
        ficha: { condition: 'nuevo', cost: '', benchmark: '', tax: false },
        category: ''
      });
      Alert.alert('Éxito', 'Producto creado correctamente');
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error al crear el producto');
      console.error(err);
    }
  };

  if (showScanner) {
    const scanLineStyle = {
      transform: [
        {
          translateY: scanLineAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
        },
      ],
    };

    return (
      <View style={styles.scannerContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "qr"],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.mask} />
          <View style={styles.centerRow}>
            <View style={styles.mask} />
            <View style={styles.scanWindow}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
            </View>
            <View style={styles.mask} />
          </View>
          <View style={[styles.mask, { justifyContent: 'center', alignItems: 'center' }]}>
            <CustomText style={styles.scanHelpText}>Apunta al código de barras</CustomText>
          </View>
        </View>
        <View style={styles.cancelButtonContainer}>
          <TouchableOpacity
            onPress={() => setShowScanner(false)}
            style={styles.cancelScanButton}
          >
            <CustomText style={styles.cancelScanText}>Cancelar</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return <View style={styles.centerContainer}><CustomText>Solicitando permiso de cámara...</CustomText></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainerWithPadding}>
        <CustomText style={styles.permissionText}>Necesitamos acceso a la cámara para escanear códigos de barras.</CustomText>
        <Button title="Dar permiso de cámara" onPress={async () => { const { status } = await Camera.requestCameraPermissionsAsync(); setHasPermission(status === 'granted'); }} variant="primary" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'transparent' }} keyboardShouldPersistTaps="handled">
      <LayoutScreen>
        <View style={styles.header}>
          <LogoPage />
          <CustomText>Crear Producto</CustomText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldGroup}>
            <CustomText style={styles.label}>Nombre del Producto *</CustomText>
            <Input placeholder="Nombre del Producto" value={formData.name} onChangeText={(text) => handleChange('name', text)} />
          </View>
          
          <View style={styles.fieldGroup}>
            <CustomText style={styles.label}>Código de Barras *</CustomText>
            <View style={styles.barcodeContainer}>
              <View style={{ flex: 1 }}>
                <Input placeholder="Código de barras del producto" value={formData.barcode} onChangeText={(text) => handleChange('barcode', text)} keyboardType="numeric" />
              </View>
              <TouchableOpacity onPress={startBarcodeScanner} style={styles.scanButton}>
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
                </TouchableOpacity>
              <TouchableOpacity onPress={handleGenerateEAN13} style={[styles.scanButton, styles.generateButton]}>
                <MaterialIcons name="qr-code" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <CustomText style={styles.label}>Tienda *</CustomText>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedStore}
                onValueChange={(itemValue) => setSelectedStore(itemValue)}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Selecciona una tienda" value="" />
                {storesList.map((store) => (
                  <Picker.Item 
                    key={store.value} 
                    label={store.label} 
                    value={store.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <CustomText style={styles.sectionTitle}>Información de la Ficha</CustomText>
            <View style={styles.fieldGroup}>
              <CustomText style={styles.label}>Condición *</CustomText>
              <Input placeholder="Ej: Nuevo, Usado" value={formData.ficha.condition} onChangeText={(text) => handleFichaChange('condition', text)} />
            </View>
            <View style={styles.fieldGroup}>
              <CustomText style={styles.label}>Costo *</CustomText>
              <Input placeholder="Costo del producto" value={formData.ficha.cost} onChangeText={(text) => handleFichaChange('cost', text)} keyboardType="numeric" />
            </View>
            <View style={styles.fieldGroup}>
              <CustomText style={styles.label}>Margen Referencial *</CustomText>
              <Input placeholder="Margen de ganancia" value={formData.ficha.benchmark} onChangeText={(text) => handleFichaChange('benchmark', text)} keyboardType="numeric" />
            </View>
            <View style={styles.switchContainer}>
              <CustomText style={styles.label}>Incluye impuesto</CustomText>
              <Switch value={formData.ficha.tax} onValueChange={(value) => handleFichaChange('tax', value)} style={{ marginLeft: 10 }} />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <CustomText style={styles.label}>Categoría *</CustomText>
            <Input placeholder="Elije una categoría..." value={formData.category} onChangeText={(text) => handleChange('category', text)} />
          </View>
        </View>

        <View style={styles.submitButtonContainer}>
          <Button title={'Crear Producto'} variant='primary' onPress={handleSubmit} disabled={false} />
        </View>
      </LayoutScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' },
  formContainer: { width: '100%', marginTop: 15, gap: 20 },
  fieldGroup: { width: '100%', gap: 8 },
  label: { fontSize: 18 },
  barcodeContainer: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  scanButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  generateButton: { backgroundColor: '#4CAF50' },
  sectionContainer: { width: '100%', gap: 18, marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  switchContainer: { width: '100%', gap: 8, flexDirection: 'row', alignItems: 'center' },
  submitButtonContainer: { width: '100%', marginTop: 30, marginBottom: 20 },
  scannerContainer: { flex: 1, backgroundColor: 'black' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  cancelButtonContainer: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  cancelScanButton: { backgroundColor: 'rgba(244, 67, 54, 0.8)', padding: 15, borderRadius: 8, alignItems: 'center' },
  cancelScanText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerContainerWithPadding: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { textAlign: 'center', marginBottom: 20 },
  overlay: { ...StyleSheet.absoluteFillObject, flex: 1 },
  mask: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  centerRow: { flexDirection: 'row', height: 200 },
  scanWindow: { width: '75%', height: '100%', overflow: 'hidden' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#fff' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  scanLine: { width: '100%', height: 2, backgroundColor: '#ff0000', shadowColor: '#ff0000', shadowOpacity: 0.8, shadowRadius: 5, elevation: 10 },
  scanHelpText: { color: 'white', fontSize: 16, marginTop: -50, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
});