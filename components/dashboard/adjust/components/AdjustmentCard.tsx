import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AdjustmentWithDetails } from '@flux/entities/Adjustment';
import CustomText from '@components/CustomText/CustomText';
import { IconAdjust } from 'svgs/IconAdjust';
import IconProfile from 'svgs/IconProfile';
import { IconCart } from 'svgs/IconCart';

const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Fecha no disponible';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
    
        if (isNaN(dateObj.getTime())) {
            return 'Fecha inválida';
        }
        
        return dateObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',   
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Fecha no disponible';
    }
};

const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
        case 'dama': return '#ef4444';
        case 'lost': return '#f59e0b';
        case 'return_to_provider': return '#3b82f6';
        case 'waste': return '#8b5cf6';
        case 'internal_use': return '#10b981';
        default: return '#6b7280';
    }
};

const getReasonBgColor = (reason: string) => {
    switch (reason.toLowerCase()) {
        case 'dama': return 'rgba(239, 68, 68, 0.1)';
        case 'lost': return 'rgba(245, 158, 11, 0.1)';
        case 'return_to_provider': return 'rgba(59, 130, 246, 0.1)';
        case 'waste': return 'rgba(139, 92, 246, 0.1)';
        case 'internal_use': return 'rgba(16, 185, 129, 0.1)';
        default: return 'rgba(107, 114, 128, 0.1)';
    }
};

const getReasonLabel = (reason: string) => {
    switch (reason.toLowerCase()) {
        case 'dama': return 'Dañado';
        case 'lost': return 'Perdido';
        case 'return_to_provider': return 'Devolución al Proveedor';
        case 'waste': return 'Merma';
        case 'internal_use': return 'Uso Interno';
        default: return reason;
    }
};

// Estilos base fuera del componente
const baseCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 5,
    borderLeftWidth: 2,
    borderWidth: 1,
    borderColor: 'rgb(230, 230, 230)',
};

const containerStyle = {
    padding: 12,
};

const headerStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
};

const reasonBadgeStyle = {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
};

const notesContainerStyle = {
    marginBottom: 12,
};

const userInfoContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 12,
};

const itemsSummaryStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
};

const itemsInfoStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
};

export default function AdjustmentCard({ adjustment, onPress }: { adjustment: AdjustmentWithDetails, onPress: (adjustment: AdjustmentWithDetails) => void }) {
    const { totalItems, totalCost } = useMemo(() => {
        const items = adjustment.items;
        const totalItems = items.reduce((sum, item) => sum + Math.abs(item.quantity), 0);
        const totalCost = items.reduce((sum, item) => sum + (Math.abs(item.quantity) * item.product.w_ficha.cost), 0);
        return { totalItems, totalCost };
    }, [adjustment.items]);

    const { reasonColor, reasonBgColor } = useMemo(() => ({
        reasonColor: getReasonColor(adjustment.reason),
        reasonBgColor: getReasonBgColor(adjustment.reason),
    }), [adjustment.reason]);

    const reasonLabel = useMemo(() => getReasonLabel(adjustment.reason), [adjustment.reason]);

    const cardStyle = useMemo(() => ({
        ...baseCardStyle,
        borderLeftColor: reasonColor,
    }), [reasonColor]);

    return (
        <TouchableOpacity 
            onPress={() => onPress(adjustment)}
            style={cardStyle}
        >
            <View style={containerStyle}>
                {/* Header */}
                <View style={headerStyle}>
                    <View style={{ 
                        ...reasonBadgeStyle,
                        backgroundColor: reasonBgColor,
                    }}>
                        <IconAdjust width={16} height={16} fill={reasonColor} />
                        <CustomText style={{ 
                            color: reasonColor, 
                            fontSize: 12, 
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {reasonLabel}
                        </CustomText>
                    </View>
                    <CustomText style={{ 
                        color: '#6b7280', 
                        fontSize: 12,
                        fontWeight: '500'
                    }}>
                        {formatDate(adjustment.adjustment_date)}
                    </CustomText>
                </View>

                {/* Notes */}
                {adjustment.notes && (
                    <View style={notesContainerStyle}>
                        <CustomText style={{ 
                            color: '#374151', 
                            fontSize: 14,
                            lineHeight: 16,
                            fontStyle: 'italic'
                        }}>
                            "{adjustment.notes}"
                        </CustomText>
                    </View>
                )}

                {/* User Info */}
                <View style={userInfoContainerStyle}>
                    <IconProfile width={16} height={16} />
                    <View style={{ flex: 1 }}>
                        <CustomText style={{ 
                            color: '#9ca3af', 
                            fontSize: 12,
                            textTransform: 'uppercase',
                            marginBottom: 1,
                            fontWeight: '500'
                        }}>
                            Usuario
                        </CustomText>
                        <CustomText style={{ 
                            color: '#374151', 
                            fontSize: 14,
                            fontWeight: '600'
                        }}>
                            {adjustment.user.name}
                        </CustomText>
                    </View>
                </View>

                {/* Items Summary */}
                <View style={itemsSummaryStyle}>
                    <View style={itemsInfoStyle}>
                        <IconCart width={16} height={16} fill="#6b7280" />
                        <View>
                            <CustomText style={{ 
                                color: '#9ca3af', 
                                fontSize: 11,
                                textTransform: 'uppercase',
                                marginBottom: 1,
                                fontWeight: '500'
                            }}>
                                Artículos
                            </CustomText>
                            <CustomText style={{ 
                                color: '#374151', 
                                fontSize: 14,
                                fontWeight: '700'
                            }}>
                                {totalItems}
                            </CustomText>
                        </View>
                    </View>
                    
                    <View style={{ alignItems: 'flex-end' as const }}>
                        <CustomText style={{ 
                            color: '#9ca3af', 
                            fontSize: 12,
                            textTransform: 'uppercase',
                            marginBottom: 2,
                            fontWeight: '500'
                        }}>
                            Valor Removido
                        </CustomText>
                        <CustomText style={{ 
                            color: '#ef4444', 
                            fontSize: 16,
                            fontWeight: '700'
                        }}>
                            -${totalCost.toFixed(2)}
                        </CustomText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}