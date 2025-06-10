import BottomTabs from '@/components/BottomTabs';
import CustomText from '@/components/CustomText/CustomText';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import Button from '@/components/Buttons/Button';
import LayoutScreen from '@/components/Layout/LayoutScreen';
import useAuthStore from '@/flux/stores/AuthStore';
import { loginAttemptAction, loginFailureAction, loginSuccessAction, logoutAttemptAction, verifySuccessAction } from '@/flux/Actions/LoginActions';
import { AuthService } from '@/flux/services/Auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StoreLogo from '@/svgs/StoreLogo';
import IconArrow from '@/svgs/IconArrow';
import ModalOptions from '@/components/Modals/ModalOptions';
import TypeStore from '@/components/TypeStore/TypeStore';
import { useGlobalStore } from '@/flux/stores/useGlobalStore';

const HomeScreen = () => {
  const { user, loading } = useAuthStore()

  const reuduceName = () => {
    const fp = user?.name.split(' ')[0]
    return fp ? (fp?.slice(0, 1) + fp?.slice(1, 2)).toUpperCase() : 'WH'
  }

  const [modalVisible, setModalVisible] = useState(false)

  const mockStores = [
    {
      id: 'erdfsdfdsfdsf',
      title: 'Tienda Principal',
    },
    {
      id: 'fdsfdsfsdf',
      title: 'Wheek San Cristóbal',
    },
    {
      id: 'fdfdsffdf',
      title: 'Wheek Palma',
    },
    {
      id: 'eieihfhdjhfdh',
      title: 'Wheek Cienfuegos',
    },
    {
      id: 'eieihfdsfdfdh',
      title: 'Wheek San Josecito',
    },
    {
      id: 'eieihfhdjhfdh',
      title: 'Wheek San Isidro',
    },
    {
      id: 'fdfryhghgjhjg',
      title: 'Wheek Cárdenas',
    }
  ]

  return (
    <LayoutScreen>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
            <Image source={require('@/assets/images/wheek/wheek.png')} style={{ width: 80, height: 50 }} resizeMode="contain"/>

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
                  <CustomText style={{ fontSize: 16 }}>{loading ? 'WH' : reuduceName()}</CustomText>
              </View>

            </View>
        </View>

        <View>
          <CustomText style={styles.screenText}>Información relevante de la app.</CustomText>
        </View>
      </View>

      <ModalOptions visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, width: '100%', justifyContent: 'space-between' }}>
          <Image source={require('@/assets/images/wheek/wheek.png')} style={{ width: 70, height: 40 }} resizeMode="contain"/>
          
          <TouchableOpacity onPress={() => router.push('/store/create')}
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

        <View>
          <CustomText>Elige la tienda a <CustomText style={{ color: 'rgb(170, 125, 241)', fontWeight: 'medium' }}>administrar</CustomText>.</CustomText>
        </View>

        <View style={{ marginTop: 10, width: '100%' }}>
          <FlatList
            key="two-columns"
            data={mockStores}
            style={{ width: '100%', height: '84%' }}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ rowGap: 12 }}
            renderItem={({ item }) => (
              <View style={{ width: '48%', minHeight: 100 }}>
                <TypeStore
                  id={item.id}
                  title={item.title}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ModalOptions>

    </LayoutScreen>
)}

const SearchScreen = () => (
  <View style={styles.screen}>
    <CustomText style={styles.screenText}>Búsqueda</CustomText>
  </View>
);

const FavoritesScreen = () => (
  <View style={styles.screen}>
    <CustomText style={styles.screenText}>Favoritos</CustomText>
  </View>
);

const ProfileScreen = () => {
  const { dispatch } = useAuthStore()

  return (
    <LayoutScreen>
      <Button title='Cerrar sesión' onPress={() => {
          dispatch(logoutAttemptAction())
          router.replace('/')
      }} variant='binary-square' />

    <CustomText style={styles.screenText}>Perfil</CustomText>
  </LayoutScreen>
  )
}


const tabs = [
  {
    id: 'home',
    label: 'Inicio',
    icon: '🏠',
    component: <HomeScreen />
  },
  {
    id: 'search',
    label: 'Buscar',
    icon: '🔍',
    component: <SearchScreen />
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    icon: '❤️',
    component: <FavoritesScreen />
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: '👤',
    component: <ProfileScreen />
  }
];

export default function Dashboard() {
  const { dispatch, authToken } = useAuthStore()

  const verifyToken = async () => {
    dispatch(loginAttemptAction())
    const token = await AsyncStorage.getItem('token')

    const { data, error } = await AuthService.verifyToken(token || authToken.access_token) 
    if (error) {
      dispatch(loginFailureAction(error))
    }
    if (data) {
      dispatch(verifySuccessAction(data.value))
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])

  return (
    <BottomTabs 
      tabs={tabs}
      initialTab="home"
      style={styles.container}
      tabBarStyle={styles.tabBar}
      tabItemStyle={styles.tabItem}
      activeTabItemStyle={styles.activeTabItem}
      textStyle={styles.tabText}
      activeTextStyle={styles.activeTabText}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  screenText: {
    fontSize: 18,
    color: '#333',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 10,
  },
  tabItem: {
    paddingVertical: 8,
  },
  activeTabItem: {
    borderTopColor: 'rgb(170, 125, 241)',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: 'rgb(170, 125, 241)',
    fontWeight: '600',
  },
});