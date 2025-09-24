import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { useLocalSearchParams } from 'expo-router';
import { AdjustmentWithDetails } from '@flux/entities/Adjustment';
import { IconAdjust } from 'svgs/IconAdjust';
import IconProfile from 'svgs/IconProfile';
import { IconCart } from 'svgs/IconCart';
import { router } from 'expo-router';
import Button from '@components/Buttons/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WheekSpecialColors } from 'constants/ui/colors';

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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

export default function AdjustmentDetail() {
    const { adjustment }: { adjustment: string } = useLocalSearchParams();
    const adjustmentParsed: AdjustmentWithDetails = JSON.parse(decodeURIComponent(adjustment));
    const insets = useSafeAreaInsets();

    const { totalItems, totalCost } = useMemo(() => {
        const items = adjustmentParsed.items || [];
        const totalItems = items.reduce((sum, item) => sum + Math.abs(item.quantity), 0);
        const totalCost = items.reduce((sum, item) => sum + (Math.abs(item.quantity) * item.product.w_ficha.cost), 0);
        return { totalItems, totalCost };
    }, [adjustmentParsed.items]);

    const { reasonColor, reasonBgColor } = useMemo(() => ({
        reasonColor: getReasonColor(adjustmentParsed.reason),
        reasonBgColor: getReasonBgColor(adjustmentParsed.reason),
    }), [adjustmentParsed.reason]);

    const reasonLabel = useMemo(() => getReasonLabel(adjustmentParsed.reason), [adjustmentParsed.reason]);

    const handleGoBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={{ height: insets.top }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <CustomText style={styles.backText}>←</CustomText>
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <IconAdjust width={24} height={24} fill="#1f2937" />
                    <CustomText style={styles.headerTitleText}>Detalle de Ajuste</CustomText>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View style={[styles.statusBadge, { backgroundColor: reasonBgColor }]}>
                            <IconAdjust width={16} height={16} fill={reasonColor} />
                            <CustomText style={[styles.statusText, { color: reasonColor }]}>
                                {reasonLabel}
                            </CustomText>
                        </View>
                        <CustomText style={styles.dateText}>
                            {formatDate(adjustmentParsed.adjustment_date)}
                        </CustomText>
                    </View>
                    
                    {adjustmentParsed.notes && (
                        <View style={styles.notesSection}>
                            <CustomText style={styles.notesLabel}>Notas:</CustomText>
                            <CustomText style={styles.notesText}>
                                "{adjustmentParsed.notes}"
                            </CustomText>
                        </View>
                    )}
                </View>

                {/* User Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <IconProfile width={20} height={20} fill="#6b7280" />
                            <CustomText style={styles.infoTitle}>Usuario</CustomText>
                        </View>
                        <CustomText style={styles.infoValue}>
                            {adjustmentParsed.user?.name || 'No especificado'}
                        </CustomText>
                    </View>
                </View>

                {/* Items Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <IconCart width={20} height={20} fill="#6b7280" />
                        <CustomText style={styles.summaryTitle}>Resumen de Artículos</CustomText>
                    </View>
                    
                    <View style={styles.summaryContent}>
                        <View style={styles.summaryItem}>
                            <CustomText style={styles.summaryLabel}>Total Artículos</CustomText>
                            <CustomText style={styles.summaryValue}>{totalItems}</CustomText>
                        </View>
                        <View style={styles.summaryItem}>
                            <CustomText style={styles.summaryLabel}>Valor Removido</CustomText>
                            <CustomText style={[styles.summaryValue, styles.totalValue]}>
                                -${totalCost.toFixed(2)}
                            </CustomText>
                        </View>
                    </View>
                </View>

                {/* Items List */}
                <View style={styles.itemsSection}>
                    <CustomText style={styles.sectionTitle}>Artículos Ajustados</CustomText>
                    
                    {adjustmentParsed.items?.map((item, index) => (
                        <View key={item.product?.name || index} style={styles.itemCard}>
                            <View style={styles.itemHeader}>
                                <CustomText style={styles.itemName}>
                                    {item.product?.name || 'Producto sin nombre'}
                                </CustomText>
                                <CustomText style={[styles.itemQuantity, {
                                    color: 'rgb(107, 104, 103)'
                                }]}>
                                    {item.quantity} unidades
                                </CustomText>
                            </View>
                            <View style={styles.itemDetails}>
                                <CustomText style={styles.itemPrice}>
                                    ${item.product?.w_ficha?.cost?.toFixed(2) || '0.00'} c/u
                                </CustomText>
                                <CustomText style={styles.itemTotal}>
                                    Pérdida: -${(Math.abs(item.quantity) * (item.product?.w_ficha?.cost || 0)).toFixed(2)}
                                </CustomText>
                            </View>
                            {item.product?.w_ficha?.condition && (
                                <View style={styles.itemCondition}>
                                    <CustomText style={styles.conditionLabel}>
                                        Condición: {item.product.w_ficha.condition}
                                    </CustomText>
                                </View>
                            )}
                        </View>
                    )) || (
                        <CustomText style={styles.noItemsText}>No hay artículos en este ajuste</CustomText>
                    )}
                </View>
            </ScrollView>
            
            {/* Action Buttons - Fixed at bottom */}
            <View style={styles.actionsContainer}>
                <Button 
                    title="Volver" 
                    onPress={() => {
                        router.back();
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        padding: 8,
    },
    backText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    statusCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    dateText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    notesSection: {
        marginTop: 8,
    },
    notesLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: '#374151',
        fontStyle: 'italic',
        lineHeight: 18,
    },
    infoSection: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    infoCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
    },
    summaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
    },
    summaryContent: {
        gap: 8,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    summaryLabel: {
        fontSize: 13,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
    },
    totalValue: {
        color: '#ef4444',
        fontSize: 16,
    },
    itemsSection: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    itemCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
    },
    itemQuantity: {
        fontSize: 13,
        fontWeight: '500',
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 12,
        color: '#6b7280',
    },
    itemTotal: {
        fontSize: 13,
        color: '#ef4444',
        fontWeight: '600',
    },
    itemCondition: {
        marginTop: 4,
    },
    conditionLabel: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    noItemsText: {
        textAlign: 'center',
        color: '#6b7280',
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    actionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: 'rgb(207, 207, 207)',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
    },
});
