import Button from "@components/Buttons/Button";
import { View } from "react-native";
import { router } from "expo-router";
import ListProducts from "../components/ListProducts";
import { Product } from "@flux/entities/Product";
import { useProductStore } from "@flux/stores/useProductStore";
import CustomText from "@components/CustomText/CustomText";

export default function ProductManagement() {
    const { error } = useProductStore()

    const goToProductDetail = (product: Product) => {
        const productString = encodeURIComponent(JSON.stringify(product));
        router.push(`/products/ProductDetail?product=${productString}`);
    }

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