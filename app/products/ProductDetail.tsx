import { View, StyleSheet, ScrollView, TouchableOpacity, Share, Text, Alert } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { router, useLocalSearchParams } from "expo-router";
import { Product } from "@flux/entities/Product";
import Barcode from 'react-native-barcode-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductService } from "@flux/services/Products/ProductService";
import { useProductStore } from "@flux/stores/useProductStore";
import { productCreateAttemptAction, productCreateFailureAction, productDeleteAction } from "@flux/Actions/ProductActions";
import { useGlobalStore } from "@flux/stores/useGlobalStore";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export default function ProductDetail() {
    const { dispatch } = useProductStore()
    const { product } = useLocalSearchParams();
    const decodedProduct = decodeURIComponent(product as string);
    const parsedProduct: Product = JSON.parse(decodedProduct);
    const { currentStore } = useGlobalStore();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Detalles del producto:\n\n` +
                    `Nombre: ${parsedProduct.name}\n` +
                    `Código de barras: ${parsedProduct.barcode}\n` +
                    `Precio: $${parseFloat(parsedProduct.w_ficha.cost).toFixed(2)}\n` +
                    `Referencia: ${parsedProduct.w_ficha.benchmark || 'No especificada'}`
            });
        } catch (error) {
            console.error('Error sharing product:', error);
        }
    };

    const deleteProduct = async (productId: string) => {
        dispatch(productCreateAttemptAction())
        const { data, error } = await ProductService.deleteProduct(productId, currentStore.id)
        if (error) {
            dispatch(productCreateFailureAction(error))
            Alert.alert(error || 'Error al eliminar el producto')
        }
        if (data) {
            dispatch(productDeleteAction(data))
            Alert.alert('Wheek | Eliminación exitosa', 'El producto ha sido movido a la papelera.');
            router.back();
        }
    };

    return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <CustomText style={styles.productName}>{parsedProduct.name}</CustomText>
                        <View style={[
                            styles.conditionBadge,
                            { backgroundColor: parsedProduct.w_ficha.condition === 'KG' ? '#e6fffa' : '#ebf8ff' }
                        ]}>
                            <CustomText style={[
                                styles.conditionText,
                                { color: parsedProduct.w_ficha.condition === 'KG' ? '#2c7a7b' : '#2b6cb0' }
                            ]}>
                                {parsedProduct.w_ficha.condition}
                            </CustomText>
                        </View>
                    </View>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                            <MaterialIcons name="share" size={24} color="#4a5568" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => 
                                router.push(`/products/create?product=${encodeURIComponent(JSON.stringify(parsedProduct))}&md=edit`)
                            } style={[styles.actionButton, { marginLeft: 12 }]}>
                            <MaterialIcons name="edit" size={24} color="#2b6cb0" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {
                                Alert.alert(
                                    'Eliminar Producto',
                                    '¿Estás seguro de que deseas eliminar este producto?',
                                    [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { text: 'Eliminar', style: 'destructive', onPress: () => deleteProduct(parsedProduct.id) }
                                    ]
                                );
                            }} 
                            style={[styles.actionButton, { marginLeft: 12 }]}
                        >
                            <MaterialIcons name="delete" size={24} color="#e53e3e" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.barcodeContainer}>
                    <View style={{ alignItems: 'center' }}>
                        <Barcode
                            value={parsedProduct.barcode || 'N/A'}
                            format="CODE128"
                            singleBarWidth={2}
                            height={100}
                            lineColor="#2d3748"
                        />
                        <Text style={{ 
                            color: '#4a5568', 
                            fontSize: 14, 
                            marginTop: 8,
                            textAlign: 'center' as const
                        }}>
                            {parsedProduct.barcode || 'Sin código de barras'}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <DetailRow 
                        label="Costo" 
                        value={`$${parseFloat(parsedProduct.w_ficha.cost).toFixed(2)}`} 
                        icon="attach-money"
                    />
                    <DetailRow 
                        label="M. Referencial" 
                        value={"% " + parsedProduct.w_ficha.benchmark || 'No especificada'} 
                        icon="assessment"
                    />
                    <DetailRow 
                        label="Impuesto" 
                        value={parsedProduct.w_ficha.tax ? 'Incluido' : 'No incluido'} 
                        icon={parsedProduct.w_ficha.tax ? 'check-circle' : 'cancel'}
                        valueStyle={{ color: parsedProduct.w_ficha.tax ? '#38a169' : '#e53e3e' }}
                    />
                    <DetailRow 
                        label="Fecha de creación" 
                        value={formatDate(parsedProduct.created_at)} 
                        icon="event"
                    />

                    <DetailRow 
                        label="ID Interno del producto" 
                        value={parsedProduct.id} 
                        icon="code"
                        valueStyle={{ color: 'rgb(134, 76, 228)' }}
                    />
                </View>
            </ScrollView>
    );
}

const DetailRow = ({ label, value, icon, valueStyle = {} }: { 
    label: string; 
    value: string; 
    icon: string;
    valueStyle?: any;
}) => (
    <View style={styles.detailRow}>
        <View style={styles.detailIconContainer}>
            <MaterialIcons name={icon as any} size={20} color="#4a5568" />
        </View>
        <View style={styles.detailTextContainer}>
            <CustomText style={styles.detailLabel}>{label}</CustomText>
            <CustomText style={[styles.detailValue, valueStyle]}>{value}</CustomText>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(248, 248, 248)',
    },
    header: {
        padding: 16,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    productName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a202c',
        marginRight: 8,
    },
    conditionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    conditionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    barcodeContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        marginVertical: 8,
        borderRadius: 8,
        margin: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        margin: 16,
        marginTop: 10,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7',
    },
    detailIconContainer: {
        width: 36,
        alignItems: 'center',
        marginRight: 12,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 13,
        color: '#718096',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        color: '#2d3748',
        fontWeight: '500',
    },
});