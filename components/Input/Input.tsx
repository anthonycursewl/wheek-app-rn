import React from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps, View, TouchableOpacity } from 'react-native';
import { IconEye } from '../../svgs/IconEye';
import { IconEyeOff } from '../../svgs/IconEyeOff';

type InputProps = Omit<TextInputProps, 'autoCapitalize'> & {
    placeholder: string;
    style?: any;
    secureTextEntry?: boolean;
    multiline?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    showPasswordToggle?: boolean;
    iconLeft?: React.ReactNode; // Add iconLeft prop
}

export default function Input({ 
    placeholder, 
    style, 
    secureTextEntry, 
    multiline = false, 
    value, 
    onChangeText,
    showPasswordToggle = false,
    iconLeft, // Destructure iconLeft
    ...props 
}: InputProps) {
    
    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Estado para almacenar el valor real de la contraseña
    const [realValue, setRealValue] = React.useState(value || '');
    
    // Tu lógica original es correcta: secureTextEntry no funciona con multiline.
    const finalMultiline = secureTextEntry ? false : multiline;
    
    // Determinar si el texto debe ser oculto
    const shouldSecureText = secureTextEntry && !showPassword;
    
    // Crear el valor enmascarado para mostrar
    const displayValue = shouldSecureText ? '•'.repeat(realValue.length) : realValue;
    
    // Manejar el cambio de texto
    const handleTextChange = (text: string) => {
        // Si estamos en modo seguro (mostrando puntos), necesitamos manejar la entrada de texto de manera diferente
        if (shouldSecureText) {
            // Si el texto es más largo que el valor real, el usuario está añadiendo caracteres
            if (text.length > realValue.length) {
                // Añadir el último carácter al valor real
                const newChar = text.slice(-1);
                setRealValue(realValue + newChar);
                if (onChangeText) {
                    onChangeText(realValue + newChar);
                }
            } 
            // Si el texto es más corto, el usuario está borrando caracteres
            else if (text.length < realValue.length) {
                // Eliminar el último carácter del valor real
                const newValue = realValue.slice(0, text.length);
                setRealValue(newValue);
                if (onChangeText) {
                    onChangeText(newValue);
                }
            }
        } else {
            // Si no estamos en modo seguro, actualizar directamente
            setRealValue(text);
            if (onChangeText) {
                onChangeText(text);
            }
        }
    };
    
    // Actualizar realValue cuando el prop value cambia
    React.useEffect(() => {
        if (value !== undefined && value !== realValue) {
            setRealValue(value);
        }
    }, [value]);
    
    // Props adicionales para campos de contraseña para evitar conflictos.
    const secureProps: Partial<TextInputProps> = secureTextEntry ? {
        autoCapitalize: 'none' as const, // Nunca autocapitalizar contraseñas.
        autoCorrect: false, // Desactivar la autocorrección.
        textContentType: 'oneTimeCode', // Workaround para iOS. 'password' a veces causa problemas con el llavero de iCloud. 'oneTimeCode' es más fiable para forzar el ocultamiento.
        autoComplete: 'off', // Desactiva el autocompletado de Google en Android.
    } : {};
    
    return (
        <View style={[styleInput.container, style]}>
            {iconLeft && <View style={styleInput.iconLeftContainer}>{iconLeft}</View>}
            <TextInput 
                value={displayValue}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                multiline={finalMultiline}
                style={[
                    styleInput.input, 
                    showPasswordToggle ? styleInput.inputWithToggle : null,
                    iconLeft ? styleInput.inputWithIconLeft : null
                ]}
                secureTextEntry={false} // Siempre false porque nosotros manejamos el enmascaramiento
                placeholderTextColor="#999"
                {...secureProps}
                {...props}
            />
            {showPasswordToggle && secureTextEntry && (
                <TouchableOpacity 
                    style={styleInput.toggleButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <IconEyeOff width={20} height={20} fill="#666" />
                    ) : (
                        <IconEye width={20} height={20} fill="#666" />
                    )}
                </TouchableOpacity>
            )}
        </View>
    )
}

const styleInput = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLeftContainer: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    input: {
        fontFamily: 'Onest-Regular',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 18,
        padding: 12,
        backgroundColor: 'rgba(199, 189, 183, 0.08)',
        flex: 1,
    },
    inputWithToggle: {
        paddingRight: 50, // Espacio para el botón de toggle
    },
    inputWithIconLeft: {
        paddingLeft: 40, // Espacio para el icono izquierdo
    },
    toggleButton: {
        position: 'absolute',
        right: 15,
        padding: 5,
        zIndex: 1,
    },
})
