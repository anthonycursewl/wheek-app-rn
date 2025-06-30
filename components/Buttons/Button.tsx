import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import CustomText from "../CustomText/CustomText";

interface ButtonProps {
    title: string;
    style?: ViewStyle | ViewStyle[];
    onPress?: () => void;
    uppercase?: boolean;
    variant?: 'primary' | 'primary-square' | 'secondary' | 'binary' | 'binary-square';
    disabled?: boolean;
}

export default function Button({ 
    title, 
    style, 
    onPress, 
    uppercase = false, 
    variant = 'primary',
    disabled = false 
}: ButtonProps) {
    const getVariantStyle = () => {
        const baseStyle = {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: variant.includes('square') ? 8 : 18,
            opacity: disabled ? 0.6 : 1,
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

    return (
        <TouchableOpacity 
            style={[styleButton.button, getVariantStyle(), style]} 
            onPress={disabled ? () => {} : onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <CustomText style={{ color: 'white', fontSize: 15 }}>{uppercase ? title.toUpperCase() : title}</CustomText>
        </TouchableOpacity>
    )
}

const styleButton = StyleSheet.create({
    button: {
        alignItems: 'center',
    }
})