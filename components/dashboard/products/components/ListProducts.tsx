import { DimensionValue, View, FlatList, Alert } from "react-native";
import { useProductStore } from "@flux/stores/useProductStore";
import { Product } from "@flux/entities/Product";
import { useEffect } from "react";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { ProductService } from "@flux/services/Products/ProductService";
import { productCreateAttemptAction, productCreateFailureAction } from "@flux/Actions/ProductActions";

// Components
import { ProductItem } from "./ProductItem";
import CustomText from "@components/CustomText/CustomText";

export default function ListProducts({ height, onPress }: { height: DimensionValue, onPress: (product: Product) => void }) {
    const { products, dispatch, take, hasMore, loading, error, clearStore } = useProductStore()
    const { currentStore } = useGlobalStore()

    const getAllProductsData = async () => {
        if (products.length !== 0 || !hasMore || loading) return;

        dispatch(productCreateAttemptAction())
        const { data, error } = await ProductService.getAllProducts(currentStore.id, products.length, take)  

        if (error) {
            dispatch(productCreateFailureAction(error))
        }

        if (data) {
            dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: { response: data } })
        }
    }

    const handleLoadMore = async () => {
        if (!hasMore || loading) return;

        dispatch(productCreateAttemptAction())
        const { data, error } = await ProductService.getAllProducts(currentStore.id, products.length, take)
        if (error) {
            dispatch(productCreateFailureAction(error))
            Alert.alert(error || 'Error al cargar los productos')
        }
        if (data) {
            dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: { response: data } })
        }
    }

    const FooterComponent = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <CustomText style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>Has llegado al final de la lista.</CustomText>
            </View>
        )
    }

    useEffect(() => {
        getAllProductsData()
    }, [])

   useEffect(() => {
        if (error) Alert.alert(error || 'Error al cargar los productos')
    }, [error]) 

    return (
            <FlatList
                data={products}
                style={{ width: '100%', height: height }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ProductItem product={item} onPress={(product) => onPress(product)} />
                )}
                onEndReached={() => handleLoadMore()}
                onEndReachedThreshold={0.1}
                onRefresh={() => {
                    clearStore()
                    getAllProductsData()
                }}
                refreshing={loading}
                ListFooterComponent={<FooterComponent />}
                keyExtractor={(item) => item.id}
            />
    )
}