import { Animated } from "react-native";
import Input from "@components/Input/Input";
import CustomText from "@components/CustomText/CustomText";
import { View, Image } from "react-native";
import Button from "../Buttons/Button";
import { stylesSteps } from "./styles";

type LoginStep = 'email' | 'password' | 'success';

export const renderStep = (
    step: LoginStep, 
    fadeAnim: Animated.Value, 
    slideAnim: Animated.Value, 
    scaleAnim: Animated.Value, 
    formData: any, 
    setFormData: any, 
    error: string | null, 
    handleEmailSubmit: () => void, 
    handlePasswordSubmit: () => void,
    setStep: (step: LoginStep) => void,
    loading: boolean,
) => {
    switch (step) {
        case 'email':
            return (
                <Animated.View style={[stylesSteps.stepContainer, {
                    padding: 25,
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ]
                }]}>
                    <View style={{ width: '100%', gap: 8 }}>
                        <CustomText style={stylesSteps.label}>
                            Correo Electrónico
                        </CustomText>
                        <Input 
                            placeholder="ejemplo@email.com" 
                            value={formData.email}
                            onChangeText={(email) => setFormData({ ...formData, email })}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {error ? <CustomText style={stylesSteps.errorText}>{error}</CustomText> : null}
                    </View>
                    <View style={{ width: '100%', marginTop: 30 }}>
                        <Button 
                            title="Siguiente" 
                            onPress={handleEmailSubmit}
                        />
                    </View>
                </Animated.View>
            );
        case 'password':
            return (
                <Animated.View style={[stylesSteps.stepContainer, {
                    padding: 25,
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ]
                }]}>
                    <View style={{ width: '100%', gap: 8 }}>
                        <CustomText style={stylesSteps.label}>
                            Contraseña
                        </CustomText>
                        <Input 
                            placeholder="Ingresa tu contraseña..." 
                            secureTextEntry 
                            value={formData.password}
                            onChangeText={(password) => setFormData({ ...formData, password })}
                            onSubmitEditing={handlePasswordSubmit}
                        />
                        {error ? <CustomText style={stylesSteps.errorText}>{error}</CustomText> : null}
                        <CustomText 
                            style={stylesSteps.linkText}
                            onPress={() => setStep('email')}
                        >
                            Cambiar correo
                        </CustomText>
                    </View>
                    <View style={{ width: '100%', marginTop: 30 }}>
                        <Button 
                            disabled={loading || formData.password.length < 1}
                            title="Iniciar sesión" 
                            onPress={handlePasswordSubmit}
                        />
                    </View>
                </Animated.View>
            );
        case 'success':
            {/* This step is skip in order to redirect to dashboard instead of render a view of success. */}
            return (
                <Animated.View style={[stylesSteps.successContainer, {
                    opacity: fadeAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ]
                }]}>
                    <View style={stylesSteps.decorationRight} />
                        <Image
                        source={require('@assets/images/wheek/wheek.png')} 
                        style={stylesSteps.logo}
                        />
                    <View style={stylesSteps.decorationLeft} />


                </Animated.View>
            );
    }
};