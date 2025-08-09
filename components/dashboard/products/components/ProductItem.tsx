import { TouchableOpacity } from "react-native"
import { View } from "react-native"
import CustomText from "@components/CustomText/CustomText"
import { Product } from "@flux/entities/Product"

export const ProductItem = ({ product, onPress }: { product: Product, onPress?: () => void }) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                marginBottom: 12,
                overflow: 'hidden',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}
        >
            <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <CustomText style={{ fontSize: 18, fontWeight: '600', color: '#1a202c' }}>
                        {product.name}
                    </CustomText>
                    <View style={{
                        backgroundColor: product.w_ficha.condition === 'KG' ? '#e6fffa' : '#ebf8ff',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 4
                    }}>
                        <CustomText style={{ 
                            color: product.w_ficha.condition === 'KG' ? '#2c7a7b' : '#2b6cb0',
                            fontSize: 12,
                            fontWeight: '600'
                        }}>
                            {product.w_ficha.condition}
                        </CustomText>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <View>
                        <CustomText style={{ fontSize: 12, color: '#718096' }}>Código de barras</CustomText>
                        <CustomText style={{ fontSize: 14, color: '#2d3748' }}>{product.barcode || 'No especificado'}</CustomText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <CustomText style={{ fontSize: 12, color: '#718096' }}>Costo</CustomText>
                        <CustomText style={{ fontSize: 14, color: '#2d3748', fontWeight: '600' }}>
                            ${parseFloat(product.w_ficha.cost).toFixed(2)}
                        </CustomText>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <View>
                        <CustomText style={{ fontSize: 12, color: '#718096' }}>M. Referencial</CustomText>
                        <CustomText style={{ fontSize: 14, color: '#2d3748' }}>
                            {"% " + product.w_ficha.benchmark || 'No especificada'}
                        </CustomText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <CustomText style={{ fontSize: 12, color: '#718096' }}>Impuesto</CustomText>
                        <CustomText style={{ 
                            fontSize: 14, 
                            color: product.w_ficha.tax ? '#38a169' : '#e53e3e',
                            fontWeight: '500'
                        }}>
                            {product.w_ficha.tax ? 'Incluido' : 'No incluido'}
                        </CustomText>
                    </View>
                </View>

                <View style={{ marginTop: 8 }}>
                    <CustomText style={{ fontSize: 12, color: '#718096' }}>ID del producto</CustomText>
                    <CustomText style={{ fontSize: 14, color: '#2d3748' }}>{product.id}</CustomText>
                </View>
            </View>
        </TouchableOpacity>
    )
}