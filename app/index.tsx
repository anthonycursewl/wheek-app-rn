import Input from "@/components/Input/Input";
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import CustomText from "../components/CustomText/CustomText";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Index() {
    const fadeAnim = useSharedValue(0.5);

    useEffect(() => {
        fadeAnim.value = withRepeat(
            withTiming(1, { 
                duration: 1000,
                easing: Easing.inOut(Easing.ease)
            }),
            -1, 
            true 
        );
    }, [fadeAnim]);

    const fadeStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <AnimatedImage 
                    source={require('@/assets/images/wheek/wheek.png')} 
                    style={[styles.logo, fadeStyle]}
                />
            </View>

            <View style={{ width: '85%', gap: 20 }}>
                <View style={{ width: '100%', gap: 8 }}>
                    <CustomText style={styles.label}>
                        Correo Electrónico
                    </CustomText>
                    <Input placeholder="ejemplo@email.com" />
                </View>

                <View style={styles.inputContainer}>
                    <CustomText style={styles.label}>
                        Contraseña
                    </CustomText>
                    <Input placeholder="Contraseña..." secureTextEntry />
                </View>
            </View>
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
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    inputContainer: {
        width: '100%',
        gap: 8,
    },
    label: {
        fontSize: 18,
        color: '#000',
    },
});