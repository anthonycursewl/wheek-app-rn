import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import { useLocalSearchParams } from 'expo-router';
import { Reception } from '@flux/entities/Reception';
import { IconReceptions } from 'svgs/IconReceptions';
import { IconProviders } from 'svgs/IconProviders';
import IconProfile from 'svgs/IconProfile';
import { IconCart } from 'svgs/IconCart';
import { router } from 'expo-router';
import Button from '@components/Buttons/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconTrash } from 'svgs/IconTrash';
import { useReceptionStore } from '@flux/stores/useReceptionStore';
import { receptionAttemptAction, receptionDeleteSuccessAction, receptionFailureAction } from '@flux/Actions/ReceptionActions';
import { ReceptionService } from '@flux/services/Receptions/ReceptionService';
import { useGlobalStore } from '@flux/stores/useGlobalStore';

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

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'rgb(16, 185, 129)';
        case 'pending': return 'rgb(245, 158, 11)';
        case 'cancelled': return 'rgb(239, 68, 68)';
        case 'in_progress': return 'rgb(59, 130, 246)';
        default: return 'rgb(107, 114, 128)';
    }
};

const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'rgba(16, 185, 129, 0.1)';
        case 'pending': return 'rgba(245, 158, 11, 0.1)';
        case 'cancelled': return 'rgba(239, 68, 68, 0.1)';
        case 'in_progress': return 'rgba(59, 130, 246, 0.1)';
        default: return 'rgba(107, 114, 128, 0.1)';
    }
};

export default function ReceptionDetail() {
    const { reception }: { reception: string } = useLocalSearchParams();
    const receptionParsed: Reception = JSON.parse(decodeURIComponent(reception));
    const insets = useSafeAreaInsets();
    const { dispatch, loading } = useReceptionStore()
    const { currentStore } = useGlobalStore()

    const { totalItems, totalCost } = useMemo(() => {
        const items = receptionParsed.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0);
        return { totalItems, totalCost };
    }, [receptionParsed.items]);

    const { statusColor, statusBgColor } = useMemo(() => ({
        statusColor: getStatusColor(receptionParsed.status),
        statusBgColor: getStatusBgColor(receptionParsed.status),
    }), [receptionParsed.status]);

    const handleGoBack = () => {
        router.back();
    };

    const deleteReception = async (id: string, store_id: string, isSoftDelete: boolean) => {
        dispatch(receptionAttemptAction())
        const { data, error } = await ReceptionService.deleteReception(id, store_id, isSoftDelete)

        if (error) {
            dispatch(receptionFailureAction(error))
            return
        }

        if (data) dispatch(receptionDeleteSuccessAction(data))
        if (router.canGoBack()) router.back()
    }

    useEffect(() => {
        console.log(receptionParsed.is_active)
    }, [])

    const handleDelete = () => {
        Alert.alert(
            'Eliminar Recepción',
            '¿Estás seguro de eliminar esta recepción?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => deleteReception(receptionParsed.id, currentStore.id, true),
                },
            ]
        );
    }

    const handleHardDelete = () => {
        Alert.alert(
            'Eliminar Recepción',
            '¿Estás seguro de eliminar de forma definitiva esta recepción? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => deleteReception(receptionParsed.id, currentStore.id, false),
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ height: insets.top }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <CustomText style={styles.backText}>←</CustomText>
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <IconReceptions width={24} height={24} fill="#1f2937" />
                        <CustomText style={styles.headerTitleText}>Detalle de Recepción</CustomText>
                    </View>
                    
                    <TouchableOpacity onPress={receptionParsed.is_active ? handleDelete : handleHardDelete}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', width: 40, height: 40, borderRadius: 10 }}>
                            <IconTrash width={24} height={24} fill="rgb(239, 68, 68)" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Status Card */}
                {
                receptionParsed.is_active === false && (
                        <View style={{ padding: 10, backgroundColor: 'rgba(255, 65, 65, 0.1)', borderRadius: 10, marginTop: 10 }}   >
                            <CustomText style={{ color: 'rgb(239, 68, 68)', fontSize: 12 }}>
                                Esta recepción ha sido eliminada. El historial queda para su referencia. 
                                Tenga en cuenta que si desea eliminarla por completo, debe eliminarla de forma definitiva
                                haciendo tap en el botón de eliminar.
                            </CustomText>
                        </View>
                    ) 
                }

                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
                            <IconReceptions width={16} height={16} fill={statusColor} />
                            <CustomText style={[styles.statusText, { color: statusColor }]}>
                                {receptionParsed.status}
                            </CustomText>
                        </View>
                        <CustomText style={styles.dateText}>
                            {formatDate(receptionParsed.reception_date)}
                        </CustomText>
                    </View>
                    
                    {receptionParsed.notes && (
                        <View style={styles.notesSection}>
                            <CustomText style={styles.notesLabel}>Notas:</CustomText>
                            <CustomText style={styles.notesText}>
                                "{receptionParsed.notes}"
                            </CustomText>
                        </View>
                    )}
                </View>

                {/* User and Provider Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <IconProfile width={20} height={20} fill="#6b7280" />
                            <CustomText style={styles.infoTitle}>Usuario</CustomText>
                        </View>
                        <CustomText style={styles.infoValue}>
                            {receptionParsed.user?.name || 'No especificado'}
                        </CustomText>
                    </View>

                    {receptionParsed.provider && (
                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <IconProviders width={20} height={20} fill="#6b7280" />
                                <CustomText style={styles.infoTitle}>Proveedor</CustomText>
                            </View>
                            <CustomText style={styles.infoValue}>
                                {receptionParsed.provider.name}
                            </CustomText>
                        </View>
                    )}
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
                            <CustomText style={styles.summaryLabel}>Valor Total</CustomText>
                            <CustomText style={[styles.summaryValue, styles.totalValue]}>
                                ${totalCost.toFixed(2)}
                            </CustomText>
                        </View>
                    </View>
                </View>

                {/* Items List */}
                <View style={styles.itemsSection}>
                    <CustomText style={styles.sectionTitle}>Artículos Recibidos</CustomText>
                    
                    {receptionParsed.items?.map((item, index) => (
                        <View key={item.id || index} style={styles.itemCard}>
                            <View style={styles.itemHeader}>
                                <CustomText style={styles.itemName}>
                                    {item.product?.name || 'Producto sin nombre'}
                                </CustomText>
                                <CustomText style={styles.itemQuantity}>
                                    {item.quantity} {item.product?.unit_type || 'unidades'}
                                </CustomText>
                            </View>
                            <View style={styles.itemDetails}>
                                <CustomText style={styles.itemPrice}>
                                    ${item.cost_price?.toFixed(2) || '0.00'} c/u
                                </CustomText>
                                <CustomText style={styles.itemTotal}>
                                    Total: ${(item.quantity * (item.cost_price || 0)).toFixed(2)}
                                </CustomText>
                            </View>
                        </View>
                    )) || (
                        <CustomText style={styles.noItemsText}>No hay artículos en esta recepción</CustomText>
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
                    disabled={loading}
                    loading={loading}
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
        gap: 14,
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
        color: '#059669',
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
        color: '#6b7280',
        fontWeight: '500',
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 12,
        color: '#6b7280',
    },
    itemTotal: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '600',
    },
    noItemsText: {
        textAlign: 'center',
        color: '#6b7280',
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    actionsSection: {
        marginTop: 24,
        marginBottom: 32,
        gap: 12,
    },
    secondaryButton: {
        backgroundColor: '#f3f4f6',
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