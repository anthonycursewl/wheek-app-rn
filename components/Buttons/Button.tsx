import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../CustomText/CustomText";

interface ButtonProps {
    title: string;
    style?: any;
    onPress?: () => void;
    uppercase?: boolean;
}

export default function Button({ title, style, onPress, uppercase }: ButtonProps) {
    return (
        <TouchableOpacity 
            style={[styleButton.button, style]} 
            onPress={onPress}
        >
            <CustomText style={{ color: 'white', fontSize: 15 }}>{uppercase ? title.toUpperCase() : title}</CustomText>
        </TouchableOpacity>
    )
}

const styleButton = StyleSheet.create({
    button: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 18,
        backgroundColor: 'rgba(94, 36, 255, 0.84)',
        alignItems: 'center',
    }
})