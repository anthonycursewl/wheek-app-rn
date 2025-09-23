import { useEffect, useState, useRef, ReactNode } from 'react';
import { StyleSheet, View, Animated, Easing, ActivityIndicator, Pressable, Platform, Text, useWindowDimensions, ViewStyle, ScrollView } from "react-native";

import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";

// Asumiendo que tus SVGs están configurados
import { IconSuccess } from 'svgs/IconSuccess';
import IconCross from 'svgs/IconCross'; 
import { IconInfo } from 'svgs/IconInfo';

// --- 1. Constantes de Configuración ---
const ALERT_CONFIG = {
    ANIMATION: {
        SLIDE_IN_DURATION: 400,
        SLIDE_OUT_DURATION: 300,
        EXPAND_DURATION: 350,
    },
    UI: {
        TOP_POSITION_IOS: 60,
        TOP_POSITION_ANDROID: 50,
        INITIAL_WIDTH_PERCENTAGE: 0.9,
        MESSAGE_TRUNCATE_LENGTH: 30,
    },
    BEHAVIOR: {
        DEFAULT_AUTO_HIDE_DURATION: 4000,
    }
};


type IconType = 'success' | 'error' | 'warning' | 'info';
const IconWarning = () => <Text style={{fontSize: 20}}>⚠️</Text>;

const AlertIcon = ({ icon }: { icon?: IconType }) => {
    switch (icon) {
        case 'success': return <IconSuccess fill={'rgb(143, 71, 226)'} width={24} height={24}/>;
        case 'error': return <IconCross width={24} height={24} fill={'rgb(226, 81, 71)'} />;
        case 'warning': return <IconWarning />;
        case 'info': return <IconInfo width={24} height={24} fill={'rgb(116, 41, 201)'} />;
        default: return <IconInfo width={24} height={24} fill={'rgb(143, 71, 226)'} />;
    }
};

const useAlertAnimations = (
    visible: boolean, 
    isExpanded: boolean, 
    autoHide: boolean, 
    duration: number, 
    onClose: () => void, 
    requiresConfirmation: boolean
) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const expandAnim = useRef(new Animated.Value(0)).current;
    
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const topPosition = Platform.OS === 'ios' ? ALERT_CONFIG.UI.TOP_POSITION_IOS : ALERT_CONFIG.UI.TOP_POSITION_ANDROID;
    const initialWidth = screenWidth * ALERT_CONFIG.UI.INITIAL_WIDTH_PERCENTAGE;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 1 : 0,
            duration: visible ? ALERT_CONFIG.ANIMATION.SLIDE_IN_DURATION : ALERT_CONFIG.ANIMATION.SLIDE_OUT_DURATION,
            easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [visible]);

    useEffect(() => {
        Animated.timing(expandAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: ALERT_CONFIG.ANIMATION.EXPAND_DURATION,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: false,
        }).start();
    }, [isExpanded]);

    useEffect(() => {
        if (requiresConfirmation || !autoHide || !visible) return;
        const timer = setTimeout(() => onClose(), duration);
        return () => clearTimeout(timer);
    }, [visible, autoHide, duration, onClose, requiresConfirmation]);
    const animatedContainerStyle: Animated.WithAnimatedObject<ViewStyle> = {
        transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [-150, 0] }) }],
        top: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [topPosition, 0] }),
        width: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [initialWidth, screenWidth] }),
        height: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [styles.container.minHeight, screenHeight] }),
        borderRadius: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
        backgroundColor: expandAnim.interpolate({ inputRange: [0, 1], outputRange: ['#f4f4f4', '#FAFAFA'] }),
    };
    
    const animatedOverlayStyle = { opacity: expandAnim };

    return { animatedContainerStyle, animatedOverlayStyle, expandAnim };
};

// --- 4. Componente Principal ---

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
    duration = ALERT_CONFIG.BEHAVIOR.DEFAULT_AUTO_HIDE_DURATION,
    requiresConfirmation = false,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
}: CustomAlertProps) {
    
    const [isMounted, setIsMounted] = useState(visible);
    const [isExpanded, setIsExpanded] = useState(false);

    const { animatedContainerStyle, animatedOverlayStyle, expandAnim } = useAlertAnimations(
        visible, isExpanded, autoHide, duration, onClose, requiresConfirmation
    );

    useEffect(() => {
        if (visible) {
            setIsMounted(true);
            setIsExpanded(false);
        } else {
            const timer = setTimeout(() => {
                setIsExpanded(false);
                setIsMounted(false);
            }, ALERT_CONFIG.ANIMATION.SLIDE_OUT_DURATION);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const handlePress = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        } else if (!requiresConfirmation) {
            setIsExpanded(false);
            onClose();
        } else {
            setIsExpanded(false);
        }
    };

    const handleConfirm = async () => {
        if (onConfirm) await onConfirm();
        onClose();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', gap: 5, flexDirection: 'row', width: '100%' }}>
                    <View style={styles.iconContainer}>
                        <AlertIcon icon={icon} />
                    </View>
                    <ActivityIndicator size="small" color="#555" />
                    <CustomText style={{ fontSize: 13 }}>Procesando...</CustomText>
                </View>
            );
        }

        const isStringMessage = typeof message === 'string';
        const truncatedMessage = isStringMessage && message.length > ALERT_CONFIG.UI.MESSAGE_TRUNCATE_LENGTH
            ? message.slice(0, ALERT_CONFIG.UI.MESSAGE_TRUNCATE_LENGTH) + '...'
            : message;
        
        const messageContent = isStringMessage ? (
            <CustomText style={isExpanded ? styles.messageExpanded : styles.message}>
                {isExpanded ? message : truncatedMessage}
            </CustomText>
        ) : null ;

        return (
            <View style={styles.textContainer}>
                <View style={styles.iconContainer}>
                    <AlertIcon icon={icon} />
                </View>
                <View style={{ flexDirection: 'column', gap: 1 }}>
                    {isExpanded ? <ScrollView style={styles.messageScroll}>{messageContent}</ScrollView> : messageContent}
                    {renderSubMessage()}
                </View>
            </View>
        );
    };

    const renderSubMessage = () => {
        let subMessageText: string | null = null;
        if (isExpanded) {
            subMessageText = requiresConfirmation ? 'elige una acción' : 'toca para cerrar.';
        } else {
            subMessageText = requiresConfirmation ? 'toca para confirmar o cancelar.' : 'toca para ver detalles.';
        }
        
        return subMessageText ? <CustomText style={styles.subMessage}>{subMessageText}</CustomText> : null;
    };
    
    const renderActionButtons = () => {
        if (!isExpanded || !requiresConfirmation) return null;

        return (
            <Animated.View style={[styles.buttonContainer, { opacity: expandAnim }]}>
                <Button title={cancelText} onPress={onClose} style={styles.button} variant="secondary" disabled={isLoading || !visible} />
                <Button title={confirmText} onPress={handleConfirm} style={styles.button} variant="primary" disabled={isLoading || !visible} />
            </Animated.View>
        );
    };

    const animatedContentStyle: ViewStyle = {
        justifyContent: isExpanded ? 'center' : 'flex-start',
    };
    
    if (!isMounted) return null;

    return (
        <>
            <Animated.View style={[styles.overlay, animatedOverlayStyle]} pointerEvents={isExpanded ? 'auto' : 'none'} />
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                <Pressable onPress={handlePress} style={[styles.pressableArea, animatedContentStyle]}>
                    <View style={styles.content}>
                        {renderContent()}
                    </View>
                    {renderActionButtons()}
                </Pressable>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255, 254, 254, 0.4)',
        zIndex: 9998,
    },
    container: {
        position: 'absolute', 
        alignSelf: 'center',
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12,
        elevation: 8, zIndex: 9999,
        overflow: 'hidden', minHeight: 65, maxHeight: '30%',
        justifyContent: 'center',
    },
    pressableArea: {
        flex: 1, paddingVertical: 16, paddingHorizontal: 14,
        paddingBottom: 20,
    },
    content: {
        flexDirection: 'row', 
        alignItems: 'flex-start',
    },
    iconContainer: {
        minWidth: 24,
    },
    textContainer: {
        flexDirection: 'row',
        flexShrink: 1, flex: 1, gap: 10,
    },
    message: {
        textAlign: 'center', fontWeight: '600',
        fontSize: 14, color: '#333333',
    },
    messageScroll: {
        maxHeight: 200,
    },
    messageExpanded: {
        textAlign: 'left',
        alignItems: 'flex-start',
        maxWidth: '92%',
        fontWeight: '600',
        fontSize: 14, 
        color: '#333333',
    },
    subMessage: {
        fontSize: 12, 
        color: '#666666',
    },
    buttonContainer: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 30,
        width: '100%', gap: 12,
    },
    button: {
       flex: 1,
    },
});