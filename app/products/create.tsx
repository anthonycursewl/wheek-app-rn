// components
import CustomText from "@components/CustomText/CustomText";
import Input from "@components/Input/Input";
import Button from "@components/Buttons/Button";
import LogoPage from "@components/LogoPage/LogoPage";
// layout
import LayoutScreen from "@components/Layout/LayoutScreen";
// React Native
import { View, Alert, ScrollView, Switch, TouchableOpacity, StyleSheet, Animated, Modal, FlatList } from "react-native";
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
import { useCategoryStore } from "@flux/stores/useCategoryStore";
import { useProviderStore } from "@flux/stores/useProviderStore";
import { categoryAttemptAction, categoryFailureAction, categorySuccessAllAction } from "@flux/Actions/CategoryAction";
import { CategoryService } from "@flux/services/Categories/CategoryService";
import { ProviderService } from "@flux/services/Providers/ProviderService";
import { getAllProvidersSuccessAction, providerAttemptAction, providerFailureAction, providerSuccessAction } from "@flux/Actions/ProviderActions";
import ModalOptions from "@components/Modals/ModalOptions";
import CategorySelectorModal from "@components/dashboard/categories/modals/CategorySelectorModal";
import ProviderSelectorModal from "@components/dashboard/providers/modals/ProviderSelectorModal";
import { Category } from "@flux/entities/Category";
import { Provider } from "@flux/entities/Provider"

// styles
import { styles } from "@components/dashboard/products/styles/styleProducts";
import { CategoryItem } from "@components/dashboard/categories/components/CategoryItem";
import { ProviderItem } from "@components/dashboard/providers/components/ProviderItem";

const audioSource = require('@assets/sounds/beep_barcode.mp3');

export default function CreateProduct() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const player = useAudioPlayer(audioSource);

  // states global
  const { currentStore } = useGlobalStore();
  const { loading: loadingCategories, hasMore: hasMoreCategories, categories, dispatch: dispatchCategory, skip: skipCategories, take: takeCategories } = useCategoryStore();
  const { loading: loadingProviders, hasMore: hasMoreProviders, providers, dispatch: dispatchProvider, page: skipProviders, limit: takeProviders } = useProviderStore();
  const { stores, dispatch: dispatchShop } = useShopStore();

  // local states
  const [storesList, setStoresList] = useState<{label: string, value: string}[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>(currentStore?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string } | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<{ id: string, name: string } | null>(null);

  // states modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);

  const getAllCategories = async () => {
    if (loadingCategories || !hasMoreCategories || categories.length !== 0) return;

    dispatchCategory(categoryAttemptAction());
    const { data, error } = await CategoryService.getAllCategories(currentStore.id, skipCategories, takeCategories);
    if (error) {
      dispatchCategory(categoryFailureAction(error));
    }
    if (data) {
      console.log("[CREATE PRODUCT - getAllCategories] \n", data)
    }
  };

  const getAllProviders = async () => {
    console.log("[CREATE PRODUCT - getAllProviders] ", hasMoreProviders)
    if (loadingProviders || !hasMoreProviders || providers.length !== 0) return;

    dispatchProvider(providerAttemptAction());
    const { data, error } = await ProviderService.getAllProviders(currentStore.id, skipProviders, takeProviders);
    if (error) {
      dispatchProvider(providerFailureAction(error));
    }
    if (data) {
      console.log("[CREATE PRODUCT - getAllProviders] \n", data)
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllProviders()
  }, []);

  const [formData, setFormData] = useState<FormProductData>({
    name: '',
    barcode: '',
    store_id: selectedStore,
    ficha: {
      condition: 'UND',
      cost: '',
      benchmark: '',
      tax: false,
    },
    category_id: selectedCategory?.id || '',
    provider_id: selectedProvider?.id || ''
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

  useEffect(() => {
    handleChange('category_id', selectedCategory?.id || '');
    handleChange('provider_id', selectedProvider?.id || '');
  }, [selectedCategory, selectedProvider]);

  const handleSubmit = () => {
    if (!formData.name || !formData.barcode || !formData.store_id || !formData.category_id || !formData.provider_id || !formData.ficha.condition || !formData.ficha.cost || !formData.ficha.benchmark) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    console.log("[CREATE PRODUCT - handleSubmit] ", formData);
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
    <>
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

            <TouchableOpacity onPress={() => setShowCategoryModal(true)}
              style={styles.selectInput}
              >
              <CustomText style={styles.inputText}>{selectedCategory?.name || 'Selecciona una categoría'}</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <CustomText style={styles.label}>Proveedor *</CustomText>

            <TouchableOpacity onPress={() => setShowProviderModal(true)}
              style={styles.selectInput}
              >
              <CustomText style={styles.inputText}>{selectedProvider?.name || 'Selecciona un proveedor'}</CustomText>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.submitButtonContainer}>
          <Button title={'Crear Producto'} variant='primary' onPress={handleSubmit} disabled={false} />
        </View>

      </LayoutScreen>
    </ScrollView>

      <ModalOptions
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        gesturesEnabled={false}
        >
          <View>
            <CustomText style={styles.modalTitle}>Selecciona una categoría</CustomText>

              <FlatList
                data={categories}
                style={{ marginTop: 16 }}
                renderItem={({ item }) => (
                  <CategoryItem item={item} 
                    onSelectCategory={() => setSelectedCategory({ id: item.id, name: item.name })} 
                  onClose={() => setShowCategoryModal(false)} />
                )}

                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 10 }}
                ListEmptyComponent={
                  <View style={{ backgroundColor: 'rgb(184, 109, 109)', padding: 16 }}>
                    <CustomText>No hay categorías disponibles</CustomText>
                  </View>
                }
              />
          </View>
        </ModalOptions>

        <ModalOptions
          visible={showProviderModal}
          onClose={() => setShowProviderModal(false)}
          gesturesEnabled={false}
          >
              <View>
                <CustomText>Selecciona un proveedor</CustomText>
              </View>

                <FlatList
                  data={providers}

                  renderItem={({ item }) => (
                    <ProviderItem 
                    item={item} 
                    short={true} 
                    onSelectProvider={(id, name) => setSelectedProvider({ id, name })} 
                    onClose={() => setShowProviderModal(false)} 
                    />
                  )}

                  keyExtractor={(item) => item.id}
                  style={{ marginTop: 5 }}
                  contentContainerStyle={{ gap: 1 }}
                  ListEmptyComponent={
                    <View>
                      <CustomText>No hay proveedores disponibles</CustomText>
                    </View>
                  }
                />
        </ModalOptions>


    </>
  );
}

