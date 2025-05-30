import Button from "@/components/Buttons/Button";
import Input from "@/components/Input/Input";
import { router } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import CustomText from "../components/CustomText/CustomText";
import { useAuth } from '../stores/useAuthStore';

type LoginStep = 'email' | 'password' | 'success';

// Simulación de usuario válido
const VALID_EMAIL = 'zerpaanthony.wx@breadriuss.com';
const VALID_PASSWORD = '1234';

const { width } = Dimensions.get('window')

export default function Index() {
    const [step, setStep] = useState<LoginStep>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        scaleAnim.setValue(0.95);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 50,
                useNativeDriver: true,
            })
        ]).start();
    }, [step]);

    const handleEmailSubmit = () => {
        if (!email) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }
       
        if (email === VALID_EMAIL) {
            setError('');
            setStep('password');
        } else {
            setError('Este correo no está registrado');
        }
    };

    const { login } = useAuth();

    const handlePasswordSubmit = async () => {
        if (!password) {
            setError('Por favor ingresa tu contraseña');
            return;
        }
        if (password === VALID_PASSWORD) {
            setError('');
            const success = await login(email, 'simulated-jwt-token');
            if (success) {
                router.replace('/dashboard');
            } 
        } else {
            setError('Contraseña incorrecta');
        }
    };

    const goToDashboard = () => {
        router.replace('/dashboard');
    }

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <Animated.View style={[styles.stepContainer, {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ]
                    }]}>
                        <View style={{ width: '100%', gap: 8 }}>
                            <CustomText style={styles.label}>
                                Correo Electrónico
                            </CustomText>
                            <Input 
                                placeholder="ejemplo@email.com" 
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            {error ? <CustomText style={styles.errorText}>{error}</CustomText> : null}
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
                    <Animated.View style={[styles.stepContainer, {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ]
                    }]}>
                        <View style={{ width: '100%', gap: 8 }}>
                            <CustomText style={styles.label}>
                                Contraseña
                            </CustomText>
                            <Input 
                                placeholder="Ingresa tu contraseña..." 
                                secureTextEntry 
                                value={password}
                                onChangeText={setPassword}
                                onSubmitEditing={handlePasswordSubmit}
                            />
                            {error ? <CustomText style={styles.errorText}>{error}</CustomText> : null}
                            <CustomText 
                                style={styles.linkText}
                                onPress={() => setStep('email')}
                            >
                                Cambiar correo
                            </CustomText>
                        </View>
                        <View style={{ width: '100%', marginTop: 30 }}>
                            <Button 
                                title="Iniciar sesión" 
                                onPress={handlePasswordSubmit}
                            />
                        </View>
                    </Animated.View>
                );
            case 'success':
                return (
                    <Animated.View style={[styles.successContainer, {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ]
                    }]}>
                        <View style={styles.decorationRight} />
                            <Image
                            source={require('../assets/images/wheek/wheek.png')} 
                            style={styles.logo}
                            />
                        <View style={styles.decorationLeft} />
                        <CustomText style={styles.successText}>¡Bienvenido!</CustomText>
                        <CustomText style={styles.successSubtext}>Inicio de sesión exitoso</CustomText>
                        <Button 
                            title="Ir al dashboard" 
                            onPress={() => goToDashboard()}
                        />
                    </Animated.View>
                );
        }
    };

    return (
        <View style={styles.container}>
            {step !== 'success' && (
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('@/assets/images/wheek/wheek.png')} 
                        style={styles.logo}
                    />
                </View>
            )}
            {renderStep()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
    },
    stepContainer: {
        width: '85%',
        alignItems: 'center',
        transform: [{ scale: 1 }],
    },
    successContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        transform: [{ scale: 1 }],
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
        transform: [{ scale: 1 }],
    },
    logo: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
        opacity: 1,
        transform: [{ scale: 1 }],
    },
    label: {
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
    },
    errorText: {
        color: '#ff3b30',
        marginTop: 5,
        fontSize: 14,
    },
    linkText: {
        color: '#007AFF',
        marginTop: 10,
        textAlign: 'right',
    },
    successText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    successSubtext: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    decorationRight: {
        position: 'absolute',
        right: -30,
        top: 15,
        width: width * 0.4,
        height: width * 0.4,
        backgroundColor: 'rgb(207, 148, 255)',
        borderRadius: width * 0.2,
        filter: 'blur(80px)',
    },
    decorationLeft: {
        position: 'absolute',
        left: -30,
        top: 30,
        width: width * 0.4,
        height: width * 0.4,
        backgroundColor: 'rgb(255, 143, 99)',
        borderRadius: width * 0.2,
        filter: 'blur(80px)',
    },
});