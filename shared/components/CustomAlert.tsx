import React, { useEffect, useState, useRef, ReactNode, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Easing,
    ActivityIndicator,
    Pressable,
    Platform,
    Text,
    useWindowDimensions,
    ViewStyle
} from "react-native";

import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { IconSuccess } from 'svgs/IconSuccess';
import IconCross from 'svgs/IconCross';
import { IconInfo } from 'svgs/IconInfo';

const CONFIG = {
    ANIMATION: {
        DURATION: 350,
        EASING_IN: Easing.out(Easing.cubic),
        EASING_OUT: Easing.in(Easing.cubic),
    },
    UI: {
        TOP_POSITION: Platform.OS === 'ios' ? 60 : 40,
        HORIZONTAL_PADDING: 16,
        MAX_WIDTH: 500,
        BORDER_RADIUS: 16,
        TEXT_MAX_HEIGHT: 120,
    },
    BEHAVIOR: {
        DEFAULT_AUTO_HIDE_DURATION: 4000,
    }
};

type IconType = 'success' | 'error' | 'warning' | 'info';

const ICONS: Record<IconType, { component: React.ComponentType<any>; color: string }> = {
    success: { component: IconSuccess, color: 'rgb(143, 71, 226)' },
    error: { component: IconCross, color: 'rgb(226, 81, 71)' },
    warning: { component: () => <Text style={{ fontSize: 22 }}>⚠️</Text>, color: '#ffc107' },
    info: { component: IconInfo, color: 'rgb(143, 71, 226)' },
};

const AlertIcon = ({ icon }: { icon?: IconType }) => {
    const selectedIcon = icon ? ICONS[icon] : ICONS.info;
    const IconComponent = selectedIcon.component;
    return <IconComponent fill={selectedIcon.color} width={26} height={26} />;
};

const useAlertAnimation = (visible: boolean) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: visible ? 1 : 0,
            duration: CONFIG.ANIMATION.DURATION,
            easing: visible ? CONFIG.ANIMATION.EASING_IN : CONFIG.ANIMATION.EASING_OUT,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const animatedStyle: ViewStyle = {
        opacity: animValue,
        transform: [
            {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                }),
            },
        ],
    };

    return { animatedStyle };
};

export interface CustomAlertProps {
    visible: boolean;
    message: string | ReactNode;
    icon?: IconType;
    onClose: () => void;
    isLoading?: boolean;
    autoHide?: boolean;
    duration?: number;
    requiresConfirmation?: boolean;
    onConfirm?: () => Promise<void> | void;
    confirmText?: string;
    cancelText?: string;
}

export default function CustomAlert({
    visible,
    message,
    icon,
    onClose,
    isLoading = false,
    autoHide = true,
    duration = CONFIG.BEHAVIOR.DEFAULT_AUTO_HIDE_DURATION,
    requiresConfirmation = false,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
}: CustomAlertProps) {

    const [isMounted, setIsMounted] = useState(visible);
    const timerRef = useRef<number | null>(null);
    const { animatedStyle } = useAlertAnimation(isMounted && visible);
    const { width } = useWindowDimensions();

    const hintText = useCallback(() => {
        if (icon === 'success') return "Operación exitosa.";
        if (icon === 'error') return "Operación fallida.";
        if (icon === 'warning') return "Operación con advertencia.";
        if (icon === 'info') return "Operación con información.";
        return "";
    }, [icon])
    
    useEffect(() => {
        if (visible) {
            setIsMounted(true);
        } else {
            const timeoutId = setTimeout(() => {
                setIsMounted(false);
            }, CONFIG.ANIMATION.DURATION);
            return () => clearTimeout(timeoutId);
        }
    }, [visible]);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (visible && autoHide && !requiresConfirmation && !isLoading) {
            timerRef.current = setTimeout(onClose, duration);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [visible, autoHide, duration, requiresConfirmation, isLoading]);

    const handlePress = () => {
        if (!requiresConfirmation && !isLoading) {
            onClose();
        }
    };

    const handleConfirm = async () => {
        if (isLoading) return;
        if (onConfirm) await onConfirm();
        onClose();
    };

    const alertWidth = Math.min(width - (CONFIG.UI.HORIZONTAL_PADDING * 2), CONFIG.UI.MAX_WIDTH);

    if (!isMounted) return null;

    return (
        <Animated.View style={[styles.wrapper, { top: CONFIG.UI.TOP_POSITION }, animatedStyle]}>
            <Pressable onPress={handlePress} style={[styles.container, { width: alertWidth }]}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        {isLoading ? <ActivityIndicator color="#555" /> : <AlertIcon icon={icon} />}
                    </View>
                    <View style={styles.textWrapper}>
                        <CustomText style={styles.message}>
                            {isLoading ? "Procesando..." : message}
                        </CustomText>
                        {!isLoading && icon ? 
                        <CustomText style={{ fontSize: 12, color: 'gray' }}>
                            {hintText()}
                        </CustomText> : null}
                    </View>
                </View>

                {requiresConfirmation && !isLoading && (
                     <View style={styles.buttonContainer}>
                        <Button title={cancelText} onPress={onClose} style={styles.button} variant="secondary" />
                        <Button title={confirmText} onPress={handleConfirm} style={styles.button} variant="primary" />
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 9999,
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: CONFIG.UI.BORDER_RADIUS,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 7,
        marginTop: 2,
    },
    textWrapper: {
        flex: 1,
    },
    message: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    button: {
        flex: 1,
    },
});