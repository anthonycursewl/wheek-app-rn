import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../CustomText/CustomText";

interface ButtonProps {
    title: string;
    style?: any;
    onPress?: () => void;
    uppercase?: boolean;
    variant?: 'primary' | 'primary-square' | 'secondary' | 'binary' | 'binary-square';
}

export default function Button({ title, style, onPress, uppercase, variant = 'primary' }: ButtonProps) {

    const varients = {
        primary: {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: 18,
            backgroundColor: 'rgba(94, 36, 255, 0.84)',
        },
        'primary-square': {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: 'rgba(94, 36, 255, 0.84)',
        },
        secondary: {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: 18,
            backgroundColor: 'rgba(94, 36, 255, 0.84)',
        },
        binary: {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: 18,
            backgroundColor: 'rgb(250, 182, 79)',
        },
        'binary-square': {
            paddingVertical: 7,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: 'rgb(250, 182, 79)',
        }
    }   

    return (
        <TouchableOpacity 
            style={[styleButton.button, style, varients[variant]]} 
            onPress={onPress}
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