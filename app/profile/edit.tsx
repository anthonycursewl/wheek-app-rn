import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import LayoutScreen from '@components/Layout/LayoutScreen';
import CustomText from '@components/CustomText/CustomText';
import Input from '@components/Input/Input';
import Button from '@components/Buttons/Button';
import useAuthStore from '@flux/stores/AuthStore';
import { AuthService } from '@flux/services/Auth/AuthService';
import LogoPage from '@components/LogoPage/LogoPage';

export default function EditProfileScreen() {
  const { user, dispatch } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setLastName(user.last_name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Assuming an update method in AuthService or similar
      // This is a placeholder. You might need to implement an actual update action/service.
      const { data, error } = await AuthService.updateProfile({ name, email }); 
      if (error) {
        Alert.alert('Error', error || 'No se pudo actualizar el perfil.');
      } else {
        // Assuming the store needs to be updated after a successful save
        // dispatch(updateUserAction(data)); // You might need to create this action
        Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      }
    } catch (err) {
      Alert.alert('Error', 'Ocurrió un error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutScreen>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <LogoPage />
          <CustomText style={styles.title}>Editar Perfil</CustomText>
        </View>

        <View style={styles.form}>
          <CustomText style={styles.inputLabel}>Nombre</CustomText>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            keyboardType="default"
          />

        <CustomText style={styles.inputLabel}>Apellido</CustomText>
          <Input
            value={lastName}
            onChangeText={setLastName}
            placeholder="Tu apellido"
            keyboardType="default"
          />

          <CustomText style={[styles.inputLabel, styles.inputMargin]}>Correo Electrónico</CustomText>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            keyboardType="email-address"
          />

          <CustomText style={[styles.inputLabel, styles.inputMargin]}>Nombre de usuario</CustomText>
          <Input
            value={username}
            onChangeText={(text) => {
              // Remove any non-allowed characters and convert to lowercase
              const formattedText = text
                .toLowerCase()
                .replace(/[^a-z0-9._-]/g, '') // Only allow letters, numbers, ., _, -
                .replace(/\s+/g, ''); // Remove any whitespace
              setUsername(formattedText);
            }}
            placeholder="nombredeusuario"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />

          <Button
            title={loading ? 'Guardando...' : 'Guardar Cambios'}
            onPress={handleSave}
            disabled={loading}
            style={styles.saveButton}
          />
        </View>
      </View>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    marginVertical: 24,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputMargin: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    fontFamily: 'Onest-Medium',
    letterSpacing: 0.2,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#5E24FF',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#5E24FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
