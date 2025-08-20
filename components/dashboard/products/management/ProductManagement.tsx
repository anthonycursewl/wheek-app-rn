import Button from "@components/Buttons/Button";
import { View } from "react-native";
import { router } from "expo-router";
import ListProducts from "../components/ListProducts";
import { Product } from "@flux/entities/Product";
import { useProductStore } from "@flux/stores/useProductStore";
import CustomText from "@components/CustomText/CustomText";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useEffect } from "react";
import useAuthStore from "@flux/stores/AuthStore";

export default function ProductManagement() {
    const { error } = useProductStore()
    const { currentStore } = useGlobalStore()
    const { user } = useAuthStore()

    const goToProductDetail = (product: Product) => {
        const productString = encodeURIComponent(JSON.stringify(product));
        router.push(`/products/ProductDetail?product=${productString}`);
    }

    useEffect(() => {
        console.log(currentStore)
        console.log(user)
    }, [])

    return (
        <View style={{ marginTop: 15, gap: 10 }}>
            <Button title="Crear producto" 
            onPress={() => router.push('/products/create')}
            />

            {error && (
                <CustomText style={{ color: 'red', fontSize: 14 }}>{error}</CustomText>
            )}
            
            <ListProducts height={'60%'} onPress={(product) => goToProductDetail(product)} />
        </View>
    )
}