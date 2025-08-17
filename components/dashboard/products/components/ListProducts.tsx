import { DimensionValue, View, FlatList, Alert } from "react-native";
import { useProductStore } from "@flux/stores/useProductStore";
import { Product } from "@flux/entities/Product";
import { useEffect } from "react";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { ProductService } from "@flux/services/Products/ProductService";
import { productCreateAttemptAction, productCreateFailureAction } from "@flux/Actions/ProductActions";


// Components
import FooterComponentList from "shared/components/FooterComponentList";
import { ProductItem } from "./ProductItem";

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

    

    useEffect(() => {
        getAllProductsData()
    }, [products.length])

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
                }}
                refreshing={loading}
                ListFooterComponent={
                    <FooterComponentList 
                    message="Has llegado al final de la lista." 
                    isVisible={hasMore} 
                    />
                }
                keyExtractor={(item) => item.id}
            />
    )
}