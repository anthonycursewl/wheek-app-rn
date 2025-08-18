import { DimensionValue, View, FlatList, Alert, ActivityIndicator } from "react-native";
import CustomText from "../../../../components/CustomText/CustomText";
import { useProductStore } from "@flux/stores/useProductStore";
import { Product } from "@flux/entities/Product";
import { useEffect } from "react";
import { useGlobalStore } from "@flux/stores/useGlobalStore";

// services
import { ProductService } from "@flux/services/Products/ProductService";

// Actions
import { productCreateAttemptAction, productCreateFailureAction } from "@flux/Actions/ProductActions";

// Components
import FooterComponentList from "shared/components/FooterComponentList";
import { ProductItem } from "./ProductItem";

export default function ListProducts({ height, onPress }: { height: DimensionValue, onPress: (product: Product) => void }) {
    const { products, dispatch, take, hasMore, loading, error, clearStore } = useProductStore()
    const { currentStore } = useGlobalStore()

    const getAllProductsData = async (isRefreshing = false) => {
        if ((!isRefreshing && products.length !== 0) || !hasMore || loading) return;

        dispatch(productCreateAttemptAction())
        const skip = isRefreshing ? 0 : products.length;
        const { data, error } = await ProductService.getAllProducts(currentStore.id, skip, take)  

        if (error) {
            dispatch(productCreateFailureAction(error))
            return;
        }

        if (data) {
            dispatch({ 
                type: 'GET_PRODUCTS_SUCCESS', 
                payload: { 
                    response: data,
                    isRefreshing 
                } 
            })
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
                onRefresh={async () => {
                    await new Promise(resolve => {
                        clearStore();
                        resolve(null);
                    });
                    await getAllProductsData(true);
                }}
                refreshing={loading}
                ListFooterComponent={
                    <FooterComponentList 
                        message={'Has llegado al final de la lista.'} 
                        isVisible={hasMore} 
                    />
                }
                keyExtractor={(item) => item.id}
            />
    )
}