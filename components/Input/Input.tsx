import { StyleSheet, TextInput } from "react-native";

interface InputProps {
    placeholder: string;
    style?: any;
    secureTextEntry?: boolean;
}

export default function Input({ placeholder, style, secureTextEntry }: InputProps) {
    return (
        <TextInput placeholder={placeholder} style={[styleInput.input, style]} secureTextEntry={secureTextEntry} />
    )
}

const styleInput = StyleSheet.create({
    input: {
        fontFamily: 'Onest-Regular',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 18,
        padding: 12,
    }
})