import React, { useMemo, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { Product } from "@flux/entities/Product";
import { IconSuccess } from 'svgs/IconSuccess';

interface ProductItemProps {
    product: Product;
    onPress?: (product: Product) => void;
}

const ProductItemComponent = ({ product, onPress }: ProductItemProps) => {
    const finalPriceProduct = useMemo(() => {
        const cost = parseFloat(product.w_ficha.cost);
        const benchmark = parseFloat(product.w_ficha.benchmark);
        return (cost + cost * (benchmark / 100)).toFixed(2);
    }, [product.w_ficha.cost, product.w_ficha.benchmark]);

    const isNew = useMemo(() => {
        if (!product.created_at) return false;
        const productDate = new Date(product.created_at);
        const now = new Date();
        const differenceInTime = now.getTime() - productDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays <= 3;
    }, [product.created_at]);

    const nameProduct = useCallback(() => {
        const text = product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name;
        return <CustomText style={styles.productName}>{text}</CustomText>;
    }, [product.name]);
    
    const taxProduct = useCallback(() => {
        const text = product.w_ficha.tax ? 'Incluido' : 'Excluido';
        const color = product.w_ficha.tax ? '#2d3748' : '#718096';
        return <CustomText style={{ fontSize: 14, color }}>{text}</CustomText>;
    }, [product.w_ficha.tax]);
    
    const conditionProduct = useCallback(() => {
        const text = product.w_ficha.condition;
        const color = product.w_ficha.condition === 'UND' ? '#2d3748' : '#718096';
        const bg = product.w_ficha.condition === 'UND' ? 'rgb(233, 228, 255)' : 'rgb(255, 245, 222)';
        const stylesCondition: ViewStyle = { backgroundColor: bg, paddingVertical: 3, paddingHorizontal: 1, borderRadius: 6, alignItems: 'center' }
        return <View style={stylesCondition}><CustomText style={{ fontSize: 14, color }}>{text}</CustomText></View>;
    }, [product.w_ficha.condition]);
    
    return (
        <View>
            <TouchableOpacity
                onPress={() => onPress?.(product)}
                style={styles.container}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.nameContainer}>{nameProduct()}</View>
                        <IconSuccess width={25} height={25} fill={'rgb(170, 125, 241)'} />
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.infoLabel}>Código de barras</CustomText>
                            <CustomText style={styles.infoValue}>{product.barcode}</CustomText>
                        </View>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.infoLabel}>Precio</CustomText>
                            <CustomText style={{ fontSize: 16, fontWeight: 'bold', color: 'rgb(54, 190, 100)' }}>${finalPriceProduct}</CustomText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.infoLabel}>M. Referencial</CustomText>
                            <CustomText style={styles.infoValue}>% {product.w_ficha.benchmark}</CustomText>
                        </View>

                        <View style={styles.infoContainer}>
                            <CustomText style={styles.infoLabel}>Costo</CustomText>
                            <CustomText style={styles.infoValue}>${product.w_ficha.cost}</CustomText>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.infoLabel}>Impuesto</CustomText>
                            {taxProduct()}
                        </View>
                        <View style={styles.infoContainer}>
                            <CustomText style={styles.infoLabel}>Condición</CustomText>
                            {conditionProduct()}
                        </View>
                    </View>
                </View>

                {isNew && (
                    <View style={styles.newBadge}>
                        <CustomText style={styles.newBadgeText}>NUEVO</CustomText>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    infoContainer: { gap: 1 },
    content: { padding: 16 },
    newBadge: {
        position: 'absolute', top: -10, right: 10, backgroundColor: '#6A4DFF',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, elevation: 5,
    },
    newBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    nameContainer: { flex: 1, marginRight: 8 },
    productName: { fontSize: 18, fontWeight: '600', color: '#1a202c' },
    conditionBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    conditionText: { fontSize: 12, fontWeight: '600' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    infoLabel: { fontSize: 12, color: '#718096' },
    infoValue: { fontSize: 14, color: '#2d3748', marginTop: 2 },
    priceText: { fontSize: 16, color: 'rgb(54, 190, 100)', fontWeight: 'bold' },
});

export default React.memo(ProductItemComponent, (prevProps, nextProps) => {
    const prevProduct = prevProps.product;
    const nextProduct = nextProps.product;
    
    const productChanged = 
        prevProduct.id !== nextProduct.id ||
        prevProduct.name !== nextProduct.name ||
        prevProduct.barcode !== nextProduct.barcode ||
        prevProduct.created_at !== nextProduct.created_at ||
        prevProduct.w_ficha.cost !== nextProduct.w_ficha.cost ||
        prevProduct.w_ficha.benchmark !== nextProduct.w_ficha.benchmark ||
        prevProduct.w_ficha.condition !== nextProduct.w_ficha.condition ||
        prevProduct.w_ficha.tax !== nextProduct.w_ficha.tax;
    
    const onPressChanged = prevProps.onPress !== nextProps.onPress;
    
    return !productChanged && !onPressChanged;
});