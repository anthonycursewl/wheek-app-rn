import { useEffect, useState, useRef, ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Animated, Easing, ActivityIndicator } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import IconCross from "svgs/IconCross";
import Button from "@components/Buttons/Button";

type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface CustomAlertProps {
    visible: boolean;
    message: string | ReactNode;
    onClose: () => void;
    onConfirm?: () => Promise<void> | void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    isLoading?: boolean;
    type?: AlertType;
}

export default function CustomAlert({ 
    visible, 
    message, 
    onClose, 
    onConfirm,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    showCancel = true,
    showConfirm = true,
    isLoading = false,
    type = 'info'
}: CustomAlertProps) {  
    const [modalVisible, setModalVisible] = useState(visible);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [showContent, setShowContent] = useState(false);

    const getTypeStyles = () => {
        const styles = {
            container: {},
            icon: {},
            text: {}
        };

        switch (type) {
            case 'success':
                styles.text = { color: '#155724' };
                break;
            case 'warning':
                styles.text = { color: '#856404' };
                break;
            case 'error':
                styles.text = { color: '#721c24' };
                break;
            default:
                styles.text = { color: '#0c5460' };
        }

        return styles;
    };

    const typeStyles = getTypeStyles();

    useEffect(() => {
        if (visible) {
            setModalVisible(true);
            
            const timer = setTimeout(() => {
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }).start();
            }, 1);

            const contentTimer = setTimeout(() => {
                setShowContent(true);
            }, 50);

            return () => {
                clearTimeout(timer);
                clearTimeout(contentTimer);
            };
        } else {
            setShowContent(false);
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 150,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(() => {
                setModalVisible(false);
            });
        }
    }, [visible]);

    const handleConfirm = async () => {
        if (onConfirm) {
            try {
                await onConfirm();
            } catch (error) {
                console.error('Error in confirmation:', error);
            }
        }
    };

    const backdropStyle = {
        opacity: animatedValue,
    };
    
    const modalContainerStyle = {
        opacity: animatedValue,
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };

    if (!modalVisible) {
        return null;
    }

    return (
        <Modal transparent visible={modalVisible} onRequestClose={onClose} statusBarTranslucent>
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <Animated.View style={[styles.container, modalContainerStyle]}>
                    <View style={styles.header}>
                        <LogoPage height={15} width={58} />
                        {!isLoading && (
                            <TouchableOpacity onPress={onClose} disabled={isLoading}>
                                <IconCross 
                                    fill={type === 'error' ? '#dc3545' : '#6c757d'} 
                                    height={20} 
                                    width={20} 
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.content}>
                        {showContent && (
                            typeof message === 'string' ? (
                                <CustomText style={[styles.message, typeStyles.text]}>
                                    {message}
                                </CustomText>
                            ) : (
                                message
                            )
                        )}
                        {isLoading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007bff" />
                            </View>
                        )}
                    </View>

                    {showContent && (showCancel || showConfirm) && (
                        <View style={styles.footer}>
                            {showCancel && (
                                <Button 
                                    title={cancelText}
                                    onPress={onClose}
                                    style={[styles.button, styles.cancelButton]}
                                    variant="secondary"
                                    disabled={isLoading}
                                />
                            )}
                            {showConfirm && onConfirm && (
                                <Button 
                                    title={isLoading ? 'Cargando...' : confirmText}
                                    onPress={handleConfirm}
                                    variant="primary"
                                    disabled={isLoading}
                                />
                            )}
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#fff',
        minHeight: 200,
        maxWidth: 280,
        minWidth: 280,
        borderRadius: 20,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 20,
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        lineHeight: 22,
    },
    loadingContainer: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        gap: 8,
    },
    button: {
        minWidth: 100,
    },
    cancelButton: {
        minWidth: 100,
        backgroundColor: 'rgb(224, 116, 116)',
    },
    confirmButton: {
        minWidth: 100,
        backgroundColor: '#007bff',
    },
    cancelButtonText: {
        color: '#fff',
    },
});