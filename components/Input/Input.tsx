import { StyleSheet, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
    placeholder: string;
    style?: any;
    secureTextEntry?: boolean;
    multiline?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
}

export default function Input({ placeholder, style, secureTextEntry, multiline = false, value, onChangeText, ...props }: InputProps) {
    return (
        <TextInput 
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            multiline={multiline}
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