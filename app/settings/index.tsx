import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LayoutScreen from '@components/Layout/LayoutScreen';

export default function SettingsScreen() {
  return (
    <LayoutScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Configuración</Text>
        <Text>Aquí podrás personalizar la configuración de la app.</Text>
      </View>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
