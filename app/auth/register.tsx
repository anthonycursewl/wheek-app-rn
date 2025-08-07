import { useState, useRef, useEffect } from "react";
import { View, Animated, StyleSheet, KeyboardAvoidingView, Platform, Image, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { renderRegisterStep } from "@components/StepsAuth/RenderRegisterSteps";
import { stylesSteps } from "@components/StepsAuth/styles";
import { FormData } from "shared/interfaces/FormUserData";
import useAuthStore from "@flux/stores/AuthStore";
import { AuthService } from "@flux/services/Auth/AuthService";
import { registerAttemptAction, registerFailureAction, registerSuccessAction } from "@flux/Actions/RegisterActions";
import { router } from "expo-router";

type RegisterStep = 'email' | 'password' | 'confirmPassword' | 'userInfo' | 'success';

export default function RegisterScreen() {
    const [currentStep, setCurrentStep] = useState<RegisterStep>('email');
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        username: '',
    });

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const { loading, error, setError, dispatch } = useAuthStore()

    useEffect(() => {
        if (error) return Alert.alert('Wheek | Error', error);
    }, [error])

    const animateTransition = (direction: 'in' | 'out', onComplete?: () => void) => {
        const animations = [
            Animated.timing(fadeAnim, {
                toValue: direction === 'in' ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: direction === 'in' ? 0 : 50,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: direction === 'in' ? 1 : 0.95,
                duration: 200,
                useNativeDriver: true,
            }),
        ];

        Animated.parallel(animations).start(onComplete);
    };

    const goToNextStep = () => {
        if (currentStep === 'email' && !formData.email.includes('@')) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }
        
        if (currentStep === 'password' && formData.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        
        if (currentStep === 'confirmPassword' && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setError('');
        
        animateTransition('out', () => {
            const steps: RegisterStep[] = ['email', 'password', 'confirmPassword', 'userInfo', 'success'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1]);
                fadeAnim.setValue(0);
                slideAnim.setValue(50);
                scaleAnim.setValue(0.95);
                animateTransition('in');
            }
        });
    };

    const goToPreviousStep = () => {
        setError('');
    
        animateTransition('out', () => {
            const steps: RegisterStep[] = ['email', 'password', 'confirmPassword', 'userInfo', 'success'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex > 0) {
                setCurrentStep(steps[currentIndex - 1]);
                fadeAnim.setValue(0);
                slideAnim.setValue(-50);
                scaleAnim.setValue(0.95);
                animateTransition('in');
            }
        });
    };

    const handleRegister = async () => {
        if (loading) return;
        dispatch(registerAttemptAction())
        const { data, error } = await AuthService.save(formData)
        if (error) {
            dispatch(registerFailureAction(error))
            return setError(error)
        }
        if (data) {
            dispatch(registerSuccessAction(data))
            setCurrentStep('success')

            setTimeout(() => {
                router.replace('/dashboard')
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {
                        currentStep !== 'success' && (
                            <View style={styles.logoContainer}>
                                <Image 
                                    source={require('@assets/images/wheek/wheek.png')} 
                                    style={stylesSteps.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        )
                    }

                    {renderRegisterStep({
                        step: currentStep,
                        fadeAnim,
                        slideAnim,
                        scaleAnim,
                        formData,
                        setFormData,
                        error,
                        handleNext: goToNextStep,
                        handleBack: goToPreviousStep,
                        loading,
                        handleRegister,
                    })}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 25,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
});