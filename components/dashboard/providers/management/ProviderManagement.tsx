import { View, ActivityIndicator, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import { useProviderStore } from "@flux/stores/useProviderStore";
import ListProviders from "../components/ListProviders";
import { Provider } from "@flux/entities/Provider";
import { useCallback } from "react";

export default function ProviderManagement() {
    const { loading, error, setSelectedProvider } = useProviderStore()

    const handleTapOnProvider = useCallback((item: Provider) => {
        setSelectedProvider(item)
        router.push('/providers/ProviderDetail')
    }, [setSelectedProvider]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Button title="Crear proveedor" 
                onPress={() => router.push('/providers/create?mode=create')}/>
                
                {error && (
                    <CustomText style={{ color: 'red' }}>{error}</CustomText>
                )}
                
                <ListProviders onSelectProvider={(item) => {
                    handleTapOnProvider(item)
                }} /> 
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        gap: 10,
        marginTop: 15,
    },
});