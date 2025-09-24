import Button from "@components/Buttons/Button";
import { Alert, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import ListProducts from "../components/ListProducts";
import { Product } from "@flux/entities/Product";
import { useProductStore } from "@flux/stores/useProductStore";
import { useWindowDimensions } from "react-native";
import { useEffect, useCallback } from "react";
import { productCreateFailureAction } from "@flux/Actions/ProductActions";

export default function ProductManagement() {
    const { height } = useWindowDimensions();
    const { error, dispatch } = useProductStore();

    const goToProductDetail = useCallback((product: Product) => {
        const productString = encodeURIComponent(JSON.stringify(product));
        router.push(`/products/ProductDetail?product=${productString}`);
    }, []);

    useEffect(() => {
        if (error) {
            Alert.alert('Wheek | Error', error);
            dispatch(productCreateFailureAction(''));
        }
    }, [error, dispatch]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Button 
                    title="Crear producto" 
                    onPress={() => router.push('/products/create')}
                />
                
                <ListProducts 
                    height={height * 0.73} 
                    onPress={goToProductDetail} 
                />
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