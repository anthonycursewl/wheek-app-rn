import { StyleSheet, TouchableOpacity, ViewStyle, Animated, Easing, View } from "react-native";
import CustomText from "../CustomText/CustomText";
import React, { useEffect, useRef, useState } from "react";

interface ButtonProps {
    title: string;
    style?: ViewStyle | ViewStyle[];
    onPress?: () => void;
    uppercase?: boolean;
    variant?: 'primary' | 'primary-square' | 'secondary' | 'binary' | 'binary-square';
    disabled?: boolean;
    loading?: boolean;
}

export default function Button({ 
    title, 
    style, 
    onPress, 
    uppercase = false, 
    variant = 'primary',
    disabled = false,
    loading = false
}: ButtonProps) {
    // Animaciones para el efecto de carga
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(-1)).current;
    const dotsAnim = useRef(new Animated.Value(0)).current;
    const [dotCount, setDotCount] = useState(0);

    // Listener para actualizar el valor de los puntos
    useEffect(() => {
        const listenerId = dotsAnim.addListener(({ value }) => {
            setDotCount(Math.floor(value));
        });
        
        return () => {
            dotsAnim.removeListener(listenerId);
        };
    }, [dotsAnim]);

    // Iniciar animaciones cuando está en estado de carga
    useEffect(() => {
        if (loading) {
            // Animación de pulso para el botón
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.95,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );

            // Animación de shimmer (brillo deslizante)
            const shimmerAnimation = Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );

            // Animación de puntos (efecto de typing)
            const dotsAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(dotsAnim, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.step0,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotsAnim, {
                        toValue: 2,
                        duration: 400,
                        easing: Easing.step0,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotsAnim, {
                        toValue: 3,
                        duration: 400,
                        easing: Easing.step0,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotsAnim, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.step0,
                        useNativeDriver: true,
                    }),
                ])
            );

            pulseAnimation.start();
            shimmerAnimation.start();
            dotsAnimation.start();

            return () => {
                pulseAnimation.stop();
                shimmerAnimation.stop();
                dotsAnimation.stop();
                pulseAnim.setValue(1);
                shimmerAnim.setValue(-1);
                dotsAnim.setValue(0);
            };
        }
    }, [loading, pulseAnim, shimmerAnim, dotsAnim]);

    // Función para renderizar los puntos animados
    const renderLoadingDots = () => {
        return '.'.repeat(dotCount);
    };

    const getVariantStyle = () => {
        const baseStyle = {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: variant.includes('square') ? 8 : 18,
            opacity: disabled || loading ? 0.8 : 1,
        };

        const variantStyles = {
            primary: {
                backgroundColor: 'rgba(94, 36, 255, 0.84)',
            },
            'primary-square': {
                backgroundColor: 'rgba(94, 36, 255, 0.84)',
            },
            secondary: {
                backgroundColor: 'rgba(94, 36, 255, 0.84)',
            },
            binary: {
                backgroundColor: 'rgb(250, 182, 79)',
            },
            'binary-square': {
                backgroundColor: 'rgb(250, 182, 79)',
            }
        };

        return { ...baseStyle, ...variantStyles[variant] };
    };

    // Estilo para el efecto shimmer
    const shimmerStyle = {
        transform: [
            {
                translateX: shimmerAnim.interpolate({
                    inputRange: [-1, 1],
                    outputRange: [-100, 100],
                }),
            },
        ],
        opacity: shimmerAnim.interpolate({
            inputRange: [-1, 0, 0.5, 1],
            outputRange: [0, 0, 0.6, 0],
        }),
    };

    // Estilo para la animación de pulso
    const pulseStyle = {
        transform: [{ scale: pulseAnim }],
    };

    return (
        <TouchableOpacity 
            style={[styleButton.button, getVariantStyle(), style, loading && pulseStyle]} 
            onPress={disabled || loading ? () => {} : onPress}
            disabled={disabled || loading}
            activeOpacity={loading ? 1 : 0.7}
        >
            {loading ? (
                <View style={styleButton.loadingContainer}>
                    {/* Efecto shimmer */}
                    <Animated.View style={[styleButton.shimmerEffect, shimmerStyle]} />
                    
                    {/* Texto de carga con puntos animados */}
                    <CustomText style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>
                        Cargando{renderLoadingDots()}
                    </CustomText>
                    
                    {/* Indicador de progreso circular */}
                    <Animated.View style={styleButton.progressIndicator}>
                        <Animated.View 
                            style={[
                                styleButton.progressFill,
                                {
                                    transform: [{
                                        rotate: pulseAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '360deg'],
                                        }),
                                    }],
                                },
                            ]}
                        />
                    </Animated.View>
                </View>
            ) : (
                <CustomText style={{ color: 'white', fontSize: 15 }}>
                    {uppercase ? title.toUpperCase() : title}
                </CustomText>
            )}
        </TouchableOpacity>
    )
}

const styleButton = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        position: 'relative',
    },
    shimmerEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 60,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
    },
    progressIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressFill: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
})