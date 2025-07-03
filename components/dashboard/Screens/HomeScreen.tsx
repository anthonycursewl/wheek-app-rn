// React and React Native
import { useState, useEffect } from 'react';
import { Alert, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { router, useRouter } from 'expo-router';

// Store and Services
import useAuthStore from '@flux/stores/AuthStore';
import { useShopStore } from '@flux/stores/useShopStore';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
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

// Icons
import IconArrow from 'svgs/IconArrow';
import StoreLogo from 'svgs/StoreLogo';
import IconStores from 'svgs/IconStores';
import IconManage from 'svgs/IconManage';

export const HomeScreen = () => {
    const { user, loading } = useAuthStore()
    const { dispatch, error, stores } = useShopStore()
    const { currentStore } = useGlobalStore()
  
    const router = useRouter();
  
  const reduceName = () => {
      const fp = user?.name.split(' ')[0]
      return fp ? (fp?.slice(0, 1) + fp?.slice(1, 2)).toUpperCase() : 'WH'
    }
  
    const [modalVisible, setModalVisible] = useState(false)
  
    const getAllStores = async () => {
        dispatch(getStoresAttemptAction())
        const { data, error } = await StoreService.getStores(user?.id || '')
        if (error) {
          dispatch(getStoresFailureAction(error))
        }
        if (data) {
          dispatch(getStoresSuccessAction(data))
        }
    }
  
    useEffect(() => {
      if (stores.length === 0 && user) {
        getAllStores()
      }
    }, [user])
  
    useEffect(() => {
      if (error) {
        Alert.alert('Wheek | Error', error)
      }

      return () => {
        dispatch(resetErrorAction())
      }
    }, [error])
  
    return (
      <LayoutScreen>
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
  
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Image source={require('@assets/images/wheek/wheek.png')} style={{ width: 80, height: 50 }} resizeMode="contain"/>
  
  
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
  
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <View style={{
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row'
                  }}>
                    <IconArrow width={14} height={14} />
                    <StoreLogo id='hoe' width={30} height={30} />
                  </View>
                </TouchableOpacity>
  
                <View style={{ 
                      backgroundColor: 'rgb(240, 240, 240)',
                      borderRadius: 50,
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}> 
                    <CustomText style={{ fontSize: 16 }}>{loading ? 'WH' : reduceName()}</CustomText>
                </View>
  
              </View>
          </View>
  
            <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                borderRadius: 12,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: 'rgba(219, 180, 255, 0.95)'
              }}>
              <IconStores width={15} height={15} />
              <CustomText style={{ fontSize: 14 }}>{currentStore.name || 'Selecciona una tienda.'}</CustomText>
            </View>
            
            <TouchableOpacity onPress={() => router.push('/store/create')}>
              <View style={{ 
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                borderRadius: 12,
                paddingVertical: 4,
                paddingHorizontal: 8,
                paddingRight: 12,
                backgroundColor: 'rgba(223, 223, 223, 0.95)' 
              }}>
                <IconManage style={{ width: 25, height: 25 }} />
                <CustomText>Administrar tienda</CustomText>
              </View>
            </TouchableOpacity>

          </View>

        <ModalOptions visible={modalVisible} onClose={() => setModalVisible(false)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, width: '100%', justifyContent: 'space-between' }}>
            <Image source={require('@assets/images/wheek/wheek.png')} style={{ width: 70, height: 40 }} resizeMode="contain"/>
            
            <TouchableOpacity onPress={() => {
              router.push('/store/create');
              setModalVisible(false)
            }}
              style={{
                backgroundColor: 'rgb(238, 238, 238)',
                borderRadius: 50,
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              >
              <CustomText style={{ fontSize: 20, color: 'rgb(68, 68, 68)' }}>+</CustomText>
            </TouchableOpacity>
          </View>
  
          <View style={{ marginTop: 10 }}>
            <CustomText>Elige la tienda a <CustomText style={{ color: 'rgb(170, 125, 241)', fontWeight: 'medium' }}>administrar</CustomText>.</CustomText>
          </View>
  
          <View style={{ marginTop: 10, width: '100%' }}>
            <FlatList
              key="two-columns"
              data={stores}
              style={{ width: '100%', height: '84%' }}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ rowGap: 12 }}
              renderItem={({ item: store }) => (
                <View style={{ width: '48%', minHeight: 100 }}>
                  <TypeStore
                    store={store}
                    setModalVisible={setModalVisible}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ModalOptions>
  
      </LayoutScreen>
  )}