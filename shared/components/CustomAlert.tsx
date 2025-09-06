import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Animated, Easing } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import IconCross from "svgs/IconCross";
import Button from "@components/Buttons/Button";

interface CustomAlertProps {
    visible: boolean;
    message: string;
    onClose: () => void;
}

export default function CustomAlert({ visible, message, onClose }: CustomAlertProps) {  
    const [modalVisible, setModalVisible] = useState(visible);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [showButton, setShowButton] = useState(false)

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

            const buttonTimer = setTimeout(() => {
                setShowButton(true)
            }, 50);

            return () => {
                clearTimeout(timer);
                clearTimeout(buttonTimer);
            };
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 150,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start(() => {
                setModalVisible(false);
                setShowButton(false)
            });
        }
    }, [visible]);


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
            <Animated.View style={[stylesModal.backdrop, backdropStyle]}>
                <Animated.View style={[stylesModal.container, modalContainerStyle]}>
                    <View style={stylesModal.title}>
                        <LogoPage height={15} width={58} />
                        <TouchableOpacity onPress={onClose}>
                            <IconCross fill="rgb(224, 81, 81)" height={20} width={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={stylesModal.content}>
                        <CustomText style={{ color: '#333', textAlign: 'center' }}>{message}</CustomText>
                    </View>

                    <View style={stylesModal.footer}>
                        {showButton && <Button title="Cerrar" onPress={onClose} />}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const stylesModal = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.34)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        minHeight: 200,
        minWidth: 260,
        maxWidth: 260,
        borderRadius: 20,
    },
    title: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        padding: 20,
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    }
});