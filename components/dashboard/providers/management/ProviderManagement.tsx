import { View, ActivityIndicator } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import Button from "@components/Buttons/Button";
import { router } from "expo-router";
import { useProviderStore } from "@flux/stores/useProviderStore";
import ListProviders from "../components/ListProviders";

export default function ProviderManagement() {
    const { loading, error } = useProviderStore()

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
            <View style={{ width: '100%', marginTop: 15, gap: 10 }}>
                <Button title="Crear proveedor" 
                onPress={() => router.push('/providers/create')}/>
                
                {loading && (
                    <ActivityIndicator size="large" color="black" />
                )}
                
                {error && (
                    <CustomText style={{ color: 'red' }}>{error}</CustomText>
                )}
                
                <ListProviders onSelectProvider={(item) => {}} /> 
            </View>
        </View>
    );
}