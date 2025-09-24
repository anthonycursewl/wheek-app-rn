import React, { useMemo } from "react";
import { View, TouchableOpacity, FlexAlignType } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { Inventory } from "@flux/entities/Inventory";
import { IconInventory } from "svgs/IconInventory";

// Funciones de utilidad fuera del componente
const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getQuantityColor = (quantity: number) => {
    if (quantity === 0) return '#ef4444';
    if (quantity < 10) return '#f59e0b';
    return '#10b981';
};

const getQuantityStatus = (quantity: number) => {
    if (quantity === 0) return 'Agotado';
    if (quantity < 10) return 'Bajo';
    return 'Disponible';
};

// Estilos base fuera del componente
const baseCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgb(243, 244, 246)',
};

const containerStyle = {
    padding: 16,
};

const headerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as FlexAlignType,
    marginBottom: 12,
};

const productInfoStyle = {
    flex: 1,
    marginRight: 12,
};

const quantityBadgeStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as FlexAlignType,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
};

const detailsStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as FlexAlignType,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
};

const detailItemStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as FlexAlignType,
    gap: 6,
};

const InventoryCard = React.memo(({ inventory, onPress }: { inventory: Inventory, onPress?: (inventory: Inventory) => void }) => {
    // Memoizar cálculos y datos derivados
    const { formattedDate, quantityColor, quantityStatus, hasCostInfo, cost } = useMemo(() => {
        const formattedDate = formatDate(inventory.updated_at);
        const quantityColor = getQuantityColor(inventory.quantity);
        const quantityStatus = getQuantityStatus(inventory.quantity);
        const hasCostInfo = inventory.product.w_ficha !== null;
        const cost = hasCostInfo ? inventory.product.w_ficha!.cost : 0;
        
        return {
            formattedDate,
            quantityColor,
            quantityStatus,
            hasCostInfo,
            cost
        };
    }, [inventory.quantity, inventory.updated_at, inventory.product.w_ficha]);

    // Memoizar estilos dinámicos
    const cardStyle = useMemo(() => baseCardStyle, []);
    const quantityBadgeStyleDynamic = useMemo(() => ({
        ...quantityBadgeStyle,
        backgroundColor: `${quantityColor}15`,
    }), [quantityColor]);

    return (
        <TouchableOpacity 
            onPress={() => onPress?.(inventory)}
            style={cardStyle}
            activeOpacity={0.7}
        >
            <View style={containerStyle}>
                {/* Header */}
                <View style={headerStyle}>
                    <View style={productInfoStyle}>
                        <CustomText style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#111827',
                            lineHeight: 20,
                            marginBottom: 2,
                        }}>
                            {inventory.product.name}
                        </CustomText>
                        <CustomText style={{
                            fontSize: 13,
                            color: '#6b7280',
                            fontWeight: '500',
                        }}>
                            {inventory.store.name}
                        </CustomText>
                    </View>
                    
                    <View style={quantityBadgeStyleDynamic}>
                        <IconInventory width={14} height={14} fill={quantityColor} />
                        <CustomText style={{
                            color: quantityColor,
                            fontSize: 12,
                            fontWeight: '700',
                            textTransform: 'uppercase' as const,
                        }}>
                            {quantityStatus}
                        </CustomText>
                    </View>
                </View>

                {/* Quantity Display */}
                <View style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                }}>
                    <CustomText style={{
                        fontSize: 24,
                        fontWeight: '800',
                        color: quantityColor,
                        textAlign: 'center',
                    }}>
                        {inventory.quantity}
                    </CustomText>
                    <CustomText style={{
                        fontSize: 11,
                        color: '#9ca3af',
                        textAlign: 'center',
                        textTransform: 'uppercase' as const,
                        fontWeight: '600',
                        marginTop: 2,
                    }}>
                        Unidades disponibles
                    </CustomText>
                </View>

                {/* Cost Information */}
                {hasCostInfo && (
                    <View style={{
                        backgroundColor: '#f0fdf4',
                        borderRadius: 6,
                        padding: 8,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center' as FlexAlignType,
                        gap: 6,
                    }}>
                        <CustomText style={{
                            fontSize: 11,
                            color: '#6b7280',
                            fontWeight: '500',
                        }}>
                            Costo unitario:
                        </CustomText>
                        <CustomText style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#059669',
                        }}>
                            ${cost.toFixed(2)}
                        </CustomText>
                    </View>
                )}

                {/* Condition */}
                {inventory.product.w_ficha && (
                    <View style={{
                        backgroundColor: '#fef3c7',
                        borderRadius: 6,
                        padding: 8,
                        marginBottom: 12,
                    }}>
                        <CustomText style={{
                            fontSize: 11,
                            color: '#92400e',
                            fontWeight: '600',
                            textTransform: 'uppercase' as const,
                            marginBottom: 2,
                        }}>
                            Condición
                        </CustomText>
                        <CustomText style={{
                            fontSize: 13,
                            color: '#78350f',
                            fontWeight: '500',
                        }}>
                            {inventory.product.w_ficha.condition}
                        </CustomText>
                    </View>
                )}

                {/* Footer Details */}
                <View style={detailsStyle}>
                    <View style={detailItemStyle}>
                        <IconInventory width={14} height={14} fill="#9ca3af" />
                        <CustomText style={{
                            fontSize: 11,
                            color: '#6b7280',
                            fontWeight: '500',
                        }}>
                            ID: {inventory.id.slice(-6)}
                        </CustomText>
                    </View>
                    
                    <View style={detailItemStyle}>
                        <CustomText style={{
                            fontSize: 11,
                            color: '#9ca3af',
                            fontWeight: '500',
                        }}>
                            Actualizado
                        </CustomText>
                        <CustomText style={{
                            fontSize: 11,
                            color: '#6b7280',
                            fontWeight: '600',
                        }}>
                            {formattedDate}
                        </CustomText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

export default InventoryCard;