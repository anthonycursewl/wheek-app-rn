import { router } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, View } from 'react-native';
import useAuthStore from "@/flux/stores/AuthStore";
import { loginAttemptAction, loginFailureAction, loginSuccessAction } from "@/flux/Actions/LoginActions";
import { AuthService } from "@/flux/services/Auth/AuthService";
import { renderStep } from "@/components/StepsAuth/RenderStepsLogin";
import { stylesSteps } from "@/components/StepsAuth/styles";
import { TouchableOpacity } from "react-native";
import CustomText from "@/components/CustomText/CustomText";

export default function Index() {
    const [step, setStep] = useState<'email' | 'password' | 'success'>('email');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const { error, loading, dispatch } = useAuthStore();

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

    const handleEmailSubmit = async () => {
        dispatch(loginAttemptAction())
        const { data, error } = await AuthService.login(formData.email, formData.password, 'email')
        if (error) {
            dispatch(loginFailureAction(error))
        }

        if (data) {
            dispatch(loginSuccessAction(data))
            setStep('password')
        }
    };

    const handlePasswordSubmit = async () => {
        dispatch(loginAttemptAction())
        const { data, error } = await AuthService.login(formData.email, formData.password, 'password')
        if (error) {
            dispatch(loginFailureAction(error))
        }

        if (data) {
            dispatch(loginSuccessAction(data))
            router.replace('/dashboard')
        }
    };

    return (
        <View style={stylesSteps.container}>
            {step !== 'success' && (
                <View style={stylesSteps.logoContainer}>
                    <Image 
                        source={require('@/assets/images/wheek/wheek.png')} 
                        style={stylesSteps.logo}
                    />
                </View>
            )}

            {renderStep(step, fadeAnim, slideAnim, scaleAnim, formData, setFormData, error, handleEmailSubmit, handlePasswordSubmit, setStep, loading)}
            
            <View style={stylesSteps.linkTextContainer}>
                <TouchableOpacity onPress={() => router.push('/auth/register')}>
                    <CustomText style={stylesSteps.linkText}>¿No tienes cuentas? Registrate aquí!</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

