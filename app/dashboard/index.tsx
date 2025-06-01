import BottomTabs from '@/components/BottomTabs';
import CustomText from '@/components/CustomText/CustomText';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import Button from '@/components/Buttons/Button';

// Componentes de ejemplo para cada pestaña
const HomeScreen = () => (
  <View style={styles.screen}>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 20 }}>
            <Image source={require('@/assets/images/wheek/wheek.png')} style={{ width: 80, height: 50 }} resizeMode="contain"/>

            <CustomText style={styles.screenText}>-</CustomText>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 5 }}>
          <Button title="Crear producto" variant='primary-square' style={{ width: '48%' }} 
          onPress={() => {
            router.push('/products/create')
          }}
          />
          <Button title="Registros" variant='binary-square' style={{ width: '48%' }} />
        </View>

    </View>



  </View>
);

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

const ProfileScreen = () => (
  <View style={styles.screen}>
    <CustomText style={styles.screenText}>Perfil</CustomText>
  </View>
);

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
    fontSize: 24,
    fontWeight: 'bold',
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