import { StyleSheet, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
    placeholder: string;
    style?: any;
    secureTextEntry?: boolean;
}

export default function Input({ placeholder, style, secureTextEntry, ...props }: InputProps) {
    return (
        <TextInput 
            placeholder={placeholder}
            style={[styleInput.input, style]}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="#999"
            {...props}
        />
    )
}

const styleInput = StyleSheet.create({
    input: {
        fontFamily: 'Onest-Regular',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 18,
        padding: 12,
        backgroundColor: 'rgba(199, 189, 183, 0.08)',
    }
})