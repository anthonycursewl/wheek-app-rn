// React and React Native
import { useState, useEffect, useMemo } from 'react';
import { Alert, FlatList, Image, TouchableOpacity, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';

// Store and Services (asumimos que estas importaciones están disponibles para todos los componentes)
import useAuthStore from '@flux/stores/AuthStore';
import { useShopStore } from '@flux/stores/useShopStore';
import { Cotizacion, useGlobalStore } from '@flux/stores/useGlobalStore';
import { 
  getStoresAttemptAction, 
  getStoresFailureAction, 
  getStoresSuccessAction, 
  resetErrorAction 
} from '@flux/Actions/StoreActions';
import { StoreService } from '@flux/services/StoreS/StoreService';

// Components
import LayoutScreen from '@components/Layout/LayoutScreen';
import CustomText from '@components/CustomText/CustomText';
import TypeStore from '@components/TypeStore/TypeStore';
import ModalOptions from '@components/Modals/ModalOptions';
import { MinimalistSales } from './components/MinimalistSales';
import { CotizacionInfoSelector } from './components/CotizacionInfoSelector';

// Icons and Assets
import IconArrow from 'svgs/IconArrow';
import StoreLogo from 'svgs/StoreLogo';
import IconStores from 'svgs/IconStores';
import IconManage from 'svgs/IconManage';
import LoadingScreen from 'shared/components/LoadingScreen';
import { StoreData } from '@flux/entities/Store';
import { CotizacionService } from '@flux/services/Cotizaciones/CotizacionService';
import { IconSuccess } from 'svgs/IconSuccess';
import { IconCart } from 'svgs/IconCart';
const wheekLogo = require('@assets/images/wheek/wheek.png');

const UserProfileIcon = ({ userName }: { userName: string }) => {
  const reduceName = (name: string) => {
    if (!name) return 'WH';
    const n = name.split(' ');
    const fp = n.length > 1 ? n[0].slice(0, 1) + n[1].slice(0, 1) : n[0].slice(0, 2);
    return fp.toUpperCase();
  };

  return (
    <View style={styles.profileIconContainer}>
      <CustomText style={{ fontSize: 16 }}>{reduceName(userName || '')}</CustomText>
    </View>
  );
};

const HomeHeader = ({ onOpenStoreSelector, userName }: { onOpenStoreSelector: () => void; userName: string }) => (
  <View style={styles.headerContainer}>
    <Image source={wheekLogo} style={styles.headerLogo} resizeMode="contain" />
    <View style={styles.headerRightContainer}>
      <TouchableOpacity onPress={onOpenStoreSelector}>
        <View style={styles.storeSelectorButton}>
          <IconArrow width={14} height={14} fill={'rgb(15, 15, 15)'} transform="rotate(270)" />
          <StoreLogo id='hoe' width={30} height={30} />
        </View>
      </TouchableOpacity>

      <UserProfileIcon userName={userName} />
    </View>
  </View>
);

const CurrentStoreInfo = ({ currentStore }: { currentStore: StoreData }) => {
  const handleManagePress = () => {
    if (!currentStore?.id) {
      Alert.alert('Selección requerida', 'Por favor, selecciona una tienda primero.');
      return;
    }
    router.push({
      pathname: '/store/manage/[id]',
      params: { id: currentStore.id },
    });
  };

  const isStoreSelected = !!currentStore?.id;

  return (
    <>
      <View style={styles.currentStoreContainer}>
        <IconStores width={15} height={15} />
        <CustomText style={{ fontSize: 14 }}>
          {currentStore.name || 'Selecciona una tienda.'}
        </CustomText>
      </View>
      
      <TouchableOpacity 
        onPress={handleManagePress}
        style={[
          styles.manageButton,
          { backgroundColor: isStoreSelected ? 'rgba(223, 223, 223, 0.95)' : 'rgba(200, 200, 200, 0.6)' }
        ]}
        disabled={!isStoreSelected}
      >
        <IconManage width={25} height={25} fill={'rgb(49, 49, 49)'} />
        <CustomText>Administrar tienda</CustomText>
      </TouchableOpacity>
    </>
  );
};

const StoreSelectorModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { user } = useAuthStore();
  const { dispatch, error, stores } = useShopStore();

  const getAllStores = async () => {
    if (stores.length !== 0 || !user?.id) return;
    
    dispatch(getStoresAttemptAction());
    const { data, error: fetchError } = await StoreService.getStores(user.id);
    
    if (fetchError) {
      dispatch(getStoresFailureAction(fetchError));
    } else if (data) {
      dispatch(getStoresSuccessAction(data));
    }
  };

  useEffect(() => {
    if (visible) {
      getAllStores();
    }
  }, [visible]);

  useEffect(() => {
    if (error) {
      Alert.alert('Wheek | Error', error);
      dispatch(resetErrorAction());
    }
  }, [error, dispatch]);

  const handleCreateStore = () => {
    router.push('/store/create');
    onClose();
  };

  return (
    <ModalOptions visible={visible} onClose={onClose}>
      <View style={styles.modalHeader}>
        <Image source={wheekLogo} style={styles.modalLogo} resizeMode="contain" />
        <TouchableOpacity onPress={handleCreateStore} style={styles.addButton}>
          <CustomText style={styles.addButtonText}>+</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.modalTitleContainer}>
        <CustomText>Elige la tienda a <CustomText style={{ color: 'rgb(170, 125, 241)', fontWeight: 'medium' }}>administrar</CustomText>.</CustomText>
      </View>

      <View style={styles.modalListContainer}>
        <FlatList
          data={stores}
          style={{ width: '100%', height: '84%' }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ rowGap: 12 }}
          renderItem={({ item: store }) => (
            <View style={{ width: '48%', minHeight: 100 }}>
              <TypeStore store={store} setModalVisible={onClose} />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ModalOptions>
  );
};

export const HomeScreen = () => {
  const { user, loading: loadingAuth } = useAuthStore();
  const { currentStore, cotizaciones, setCotizaciones } = useGlobalStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [cotizacionVisible, setCotizacionVisible] = useState(false);
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(false);

  const getAllCotizaciones = async () => {
    if (cotizaciones.length !== 0) return;

    setLoadingCotizaciones(true);
    const { data, error } = await CotizacionService.getAllCotizaciones();
    if (error) {
      return setLoadingCotizaciones(false)
    }
    setCotizaciones(data || [])
    setLoadingCotizaciones(false)
  }

  useEffect(() => {
    getAllCotizaciones()
  }, [currentStore.id])

  const RenderCotizacion = ({ onPress }: { onPress: () => void }) => {
    if (loadingCotizaciones) {
      return (
        <View>
          <CustomText style={{ fontSize: 12 }}>Cargando...</CustomText>
        </View>
      )
    } 

    return (
      <Pressable onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ alignItems: 'flex-start' }}>
            <CustomText style={{ fontSize: 12 }}>Tasa BCV</CustomText>
            <CustomText style={{ fontSize: 14 }}>{cotizaciones && cotizaciones.length > 0 ? 'Bs ' + cotizaciones[0].promedio.toFixed(2) : 'N/A'}</CustomText>
          </View>

          <View>
            <IconArrow width={14} height={14} fill={'rgb(15, 15, 15)'} transform="rotate(180)" />
          </View>
        </View>
      </Pressable>
    )
  }

  if (loadingAuth) {
    return <LoadingScreen />;
  }

  return (
    <LayoutScreen>
      <View style={styles.mainContainer}>
        <HomeHeader 
          userName={user?.name || ''}
          onOpenStoreSelector={() => setModalVisible(true)}
          />

        <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <CustomText>¡Hola {user?.name.slice(0, 20) + (user?.name ? user?.name.length > 20 ? '...' : '' : '')}!</CustomText>
            <IconSuccess width={20} height={20} fill={'rgb(133, 87, 206)'} />
          </View>

            <RenderCotizacion onPress={() => setCotizacionVisible(true)} />
        </View>
        <CurrentStoreInfo currentStore={currentStore} />

        <View style={{ marginTop: 15, width: '100%' }}>
          <CustomText>Ventas</CustomText>
          <CustomText style={{ color: 'rgb(129, 129, 129)', fontSize: 13 }}>Listado de ventas filtrado por fecha y divisa. </CustomText>

          <MinimalistSales />
        </View>

        <TouchableOpacity 
        onPress={() => router.push('/checkout/checkout')}
        style={{ 
          marginTop: 15, 
          width: '100%', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderColor: 'rgb(165, 132, 255)',
          borderStyle: 'dashed',
          height: 100,
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          flexDirection: 'row',
          gap: 5
          }}>
            <IconCart width={28} height={28} fill={'rgb(165, 132, 255)'} />
          <CustomText style={{ fontSize: 16, color: 'rgb(165, 132, 255)'}}>Administrar cajas</CustomText>
        </TouchableOpacity>
      </View>

      <StoreSelectorModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />

      <CotizacionInfoSelector 
        cotizaciones={cotizaciones}
        visible={cotizacionVisible} 
        onClose={() => setCotizacionVisible(false)} 
      />
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerLogo: {
    width: 80,
    height: 50,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  storeSelectorButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  profileIconContainer: {
    backgroundColor: 'rgb(240, 240, 240)',
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(219, 180, 255, 0.95)',
  },
  manageButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    paddingRight: 12,
  },
  // Estilos del Modal
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
    justifyContent: 'space-between',
  },
  modalLogo: {
    width: 70,
    height: 40,
  },
  addButton: {
    backgroundColor: 'rgb(238, 238, 238)',
    borderRadius: 50,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: 'rgb(68, 68, 68)',
  },
  modalTitleContainer: {
    marginTop: 10,
  },
  modalListContainer: {
    marginTop: 10,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  mainTitle: {
    fontSize: 12,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});