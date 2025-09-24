import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { WheekSpecialColors } from "constants/ui/colors";

interface LoadingIndicatorProps {
    type?: 'header' | 'footer';
    message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
    type = 'header', 
    message = type === 'header' ? 'Cargando recepciones...' : 'Cargando más...' 
}) => {
    return (
        <View style={[styles.container, ...(type === 'footer' ? [styles.footerContainer] : [])]}>
            <ActivityIndicator 
                size={type === 'header' ? 'large' : 'small'} 
                color={WheekSpecialColors.primary} 
            />
            <CustomText style={[styles.text, ...(type === 'footer' ? [styles.footerText] : [])]}>
                {message}
            </CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerContainer: {
        paddingVertical: 20,
    },
    text: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    footerText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 8,
    },
});

export default LoadingIndicator;
