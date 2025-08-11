import Button from "@components/Buttons/Button";
import { FlatList, View, Alert } from "react-native";
import { useProductStore } from "@flux/stores/useProductStore";
import { ProductItem } from "../components/ProductItem"; 
import { router } from "expo-router";
import { Product } from "@flux/entities/Product";
import { useEffect } from "react";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { ProductService } from "@flux/services/Products/ProductService";
import { productCreateAttemptAction, productCreateFailureAction } from "@flux/Actions/ProductActions";

export default function ProductManagement() {
    const { products, dispatch, skip, take, hasMore, loading, error } = useProductStore()
    const { currentStore } = useGlobalStore()

    const getAllProductsData = async () => {
        if (products.length !== 0 || !hasMore || loading) return;

        dispatch(productCreateAttemptAction())
        const { data, error } = await ProductService.getAllProducts(currentStore.id, skip, take)  

        if (error) {
            dispatch(productCreateFailureAction(error))
        }

        if (data) {
            dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: { products: data, reset: false } })
        }
    }

    useEffect(() => {
        getAllProductsData()
    }, [])

    useEffect(() => {
        if (error) Alert.alert(error || 'Error al cargar los productos')
    }, [error])

    const goToProductDetail = (product: Product) => {
        const productString = encodeURIComponent(JSON.stringify(product));
        router.push(`/products/ProductDetail?product=${productString}`);
    }

    return (
        <View style={{ marginTop: 20, gap: 10 }}>
            <Button title="Crear producto" 
            onPress={() => router.push('/products/create')}
            />
            
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductItem product={item} onPress={() => goToProductDetail(item)} />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}