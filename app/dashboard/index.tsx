import BottomTabs from '@/components/BottomTabs';
import CustomText from '@/components/CustomText/CustomText';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import Button from '@/components/Buttons/Button';
import LayoutScreen from '@/components/Layout/LayoutScreen';
import useAuthStore from '@/flux/stores/AuthStore';
import { loginAttemptAction, loginFailureAction, loginSuccessAction, logoutAttemptAction, verifySuccessAction } from '@/flux/Actions/LoginActions';
import { AuthService } from '@/flux/services/Auth/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes de ejemplo para cada pestaña
const HomeScreen = () => {
  const { user, loading } = useAuthStore()

  const reuduceName = () => {
    const fp = user?.name.split(' ')[0]
    return fp ? (fp?.slice(0, 1) + fp?.slice(1, 2)).toUpperCase() : 'WH'
  }

  return (
    <View style={styles.screen}>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 }}>
            <Image source={require('@/assets/images/wheek/wheek.png')} style={{ width: 80, height: 50 }} resizeMode="contain"/>

            <View style={{ 
              backgroundColor: 'rgb(240, 240, 240)',
              borderRadius: 50,
              width: 45,
              height: 45,
              alignItems: 'center',
              justifyContent: 'center'
            }}> 
              <CustomText style={styles.screenText}>{reuduceName()}</CustomText>
            </View>
        </View>

        <View>
          <CustomText style={styles.screenText}>Elige una opción.</CustomText>
        </View>

    </View>
  </View>
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