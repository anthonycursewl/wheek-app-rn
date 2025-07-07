import { Animated } from "react-native";
import Input from "@components/Input/Input";
import CustomText from "@components/CustomText/CustomText";
import { View, Image } from "react-native";
import Button from "../Buttons/Button";
import { stylesSteps } from "./styles";

type RegisterStep = 'email' | 'password' | 'confirmPassword' | 'userInfo' | 'success';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
};

type RegisterStepProps = {
  step: RegisterStep;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  formData: FormData;
  setFormData: (data: FormData) => void;
  error: string | null;
  handleNext: () => void;
  handleBack: () => void;
  loading: boolean;
  handleRegister: () => void;
};

export const renderRegisterStep = ({
  step,
  fadeAnim,
  slideAnim,
  scaleAnim,
  formData,
  setFormData,
  error,
  handleNext,
  handleBack,
  loading,
  handleRegister,
}: RegisterStepProps) => {
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  switch (step) {
    case 'email':
      return (
        <Animated.View style={[stylesSteps.stepContainer, {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }]}>
          <CustomText style={stylesSteps.label}>Correo electrónico</CustomText>
          <Input
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={{ width: '100%'}}
          />
          {error && <CustomText style={stylesSteps.errorText}>{error}</CustomText>}
          <View style={stylesSteps.buttonContainer}>
            <Button
              title="Siguiente"
              onPress={handleNext}
              disabled={!formData.email.includes('@')}
            />
          </View>
        </Animated.View>
      );

    case 'password':
      return (
        <Animated.View style={[stylesSteps.stepContainer, {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }]}>
          <CustomText style={stylesSteps.label}>Crea una contraseña</CustomText>
          <Input
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            secureTextEntry
            style={{ width: '100%'}}
          />
          <CustomText style={stylesSteps.hintText}>
            La contraseña debe tener al menos 8 caracteres.
          </CustomText>
          {error && <CustomText style={stylesSteps.errorText}>{error}</CustomText>}

          <View style={stylesSteps.buttonContainer}>
            <Button
              title="Atrás"
              onPress={handleBack}
              variant="secondary"
              style={[stylesSteps.secondaryButton, { width: '50%' }]}
            />
            <Button
              title="Siguiente"
              onPress={handleNext}
              disabled={!formData.password || formData.password.length < 8}
              style={[stylesSteps.secondaryButton, { width: '50%' }]}
            />
          </View>

        </Animated.View>
      );

    case 'confirmPassword':
      return (
        <Animated.View style={[stylesSteps.stepContainer, {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }]}>
          <CustomText style={stylesSteps.label}>Confirma tu contraseña</CustomText>
          <Input
            placeholder="Vuelve a ingresar tu contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            secureTextEntry
            style={{ width: '100%'}}
          />
          {error && <CustomText style={stylesSteps.errorText}>{error}</CustomText>}
          <View style={stylesSteps.buttonContainer}>
            <Button
              title="Atrás"
              onPress={handleBack}
              variant="secondary"
              style={[stylesSteps.secondaryButton, { width: '50%' }]}
            />
            <Button
              title="Siguiente"
              onPress={handleNext}
              disabled={!formData.confirmPassword || formData.password !== formData.confirmPassword}
              style={[stylesSteps.secondaryButton, { width: '50%' }]}
            />
          </View>
        </Animated.View>
      );
    case 'userInfo':
      return (
        <Animated.View style={[stylesSteps.stepContainer, {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }]}>
          <CustomText style={stylesSteps.label}>Nombre de usuario</CustomText>
          <Input
            placeholder="Ingresa tu nombre de usuario"
            value={formData.username}
            onChangeText={(text) => updateFormData('username', text)}
            autoCapitalize="none"
            style={{ width: '100%' }}
          />
          <CustomText style={stylesSteps.hintText}>
            El nombre de usuario debe tener al menos 2 caracteres.
          </CustomText>
          
          <CustomText style={[stylesSteps.label, { marginTop: 16 }]}>Nombre</CustomText>
          <Input
            placeholder="Ingresa tu nombre"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
            autoCapitalize="words"
            style={{ width: '100%'}}
          />
          <CustomText style={[stylesSteps.label, { marginTop: 16 }]}>
            Apellido
          </CustomText>
          <Input
            placeholder="Ingresa tu apellido"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
            autoCapitalize="words"
            style={{ width: '100%'}}
          />
          {error && <CustomText style={stylesSteps.errorText}>{error}</CustomText>}
          <View style={stylesSteps.buttonContainer}>
            <Button
              title="Atrás"
              onPress={handleBack}
              variant="secondary"
              style={[stylesSteps.secondaryButton, { width: '50%' }]}
            />
            <Button
              title="Registrarme"
              onPress={handleRegister}
              disabled={!formData.firstName || !formData.lastName || !formData.username || formData.username.length < 2}
              style={[stylesSteps.secondaryButton, { width: '50%' }]}
            />
          </View>
        </Animated.View>
      );

    case 'success':
      return (
        <Animated.View style={[stylesSteps.successContainer, {
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim }
          ]
        }]}>
          <View style={stylesSteps.logoContainer}>
            <Image
                source={require('@assets/images/wheek/wheek.png')} 
                style={stylesSteps.logo}
            />
          </View>
          
          <CustomText style={stylesSteps.successTitle}>¡Registro exitoso!</CustomText>
          <CustomText style={stylesSteps.successText}>
            Hola {formData.firstName}, tu cuenta ha sido creada exitosamente.
          </CustomText>
          <Button
            title="Continuar"
            onPress={() => {console.log("Buenas tardes")}}
            style={stylesSteps.fullWidthButton}
          />
        </Animated.View>
      );

    default:
      return null;
  }
};
