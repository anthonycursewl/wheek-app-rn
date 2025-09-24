import React, { useMemo, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";

// interfaces
import { Reception } from "@flux/entities/Reception";

// svgs
import { IconReceptions } from "svgs/IconReceptions";
import { IconProviders } from "svgs/IconProviders";
import IconProfile from "svgs/IconProfile";
import { IconCart } from "svgs/IconCart";

// colors
import { WheekSpecialColors } from "constants/ui/colors";

const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return '#10b981';
        case 'pending': return WheekSpecialColors.binary;
        case 'cancelled': return '#ef4444';
        case 'processing': return WheekSpecialColors.secondary;
        default: return '#6b7280';
    }
};

const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return 'rgba(16, 185, 129, 0.1)';
        case 'pending': return 'rgba(250, 182, 79, 0.1)';
        case 'cancelled': return 'rgba(239, 68, 68, 0.1)';
        case 'processing': return 'rgba(255, 143, 99, 0.1)';
        default: return 'rgba(107, 114, 128, 0.1)';
    }
};

// --- Estilos (Correctamente fuera del componente usando StyleSheet) ---
// Usar StyleSheet.create es una optimización en sí misma, ya que envía los estilos
// al lado nativo una sola vez y se hace referencia a ellos por un ID.
const styles = StyleSheet.create({
    baseCard: {
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
    },
    container: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    dateText: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: '500'
    },
    notesContainer: {
        marginBottom: 12,
    },
    notesText: {
        color: '#374151',
        fontSize: 14,
        lineHeight: 16,
        fontStyle: 'italic'
    },
    userProviderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        marginRight: 8,
    },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        marginLeft: 8,
    },
    infoLabel: {
        color: '#9ca3af',
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 1,
        fontWeight: '500'
    },
    infoValue: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600'
    },
    itemsSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    itemsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemsLabel: {
        color: '#9ca3af',
        fontSize: 11,
        textTransform: 'uppercase',
        marginBottom: 1,
        fontWeight: '500'
    },
    itemsValue: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '700'
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        color: '#9ca3af',
        fontSize: 12,
        textTransform: 'uppercase',
        marginBottom: 2,
        fontWeight: '500'
    },
    totalValue: {
        color: '#059669',
        fontSize: 16,
        fontWeight: '700'
    }
});


const ReceptionCard = React.memo(({ reception, onPress }: { reception: Reception, onPress: (reception: Reception) => void }) => {
    
    // Memoriza el cálculo de totales. Solo se ejecuta si reception.items cambia.
    const { totalItems, totalCost } = useMemo(() => {
        const items = reception.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0);
        return { totalItems, totalCost };
    }, [reception.items]);

    // Memoriza los colores basados en el estado. Solo se ejecuta si reception.status cambia.
    const { statusColor, statusBgColor } = useMemo(() => ({
        statusColor: getStatusColor(reception.status),
        statusBgColor: getStatusBgColor(reception.status),
    }), [reception.status]);
    
    // --- OPTIMIZACIÓN: Memorizar la función de callback ---
    // Esto evita que se cree una nueva función en cada render.
    const handlePress = useCallback(() => {
        onPress(reception);
    }, [onPress, reception]);

    // --- OPTIMIZACIÓN: Memorizar objetos de estilo dinámicos ---
    // Estos estilos solo se recalcularán si su dependencia (statusColor/statusBgColor) cambia.
    const cardStyle = useMemo(() => ([
        styles.baseCard,
        { borderLeftColor: statusColor },
    ]), [statusColor]);

    const statusBadgeDynamicStyle = useMemo(() => ({
        backgroundColor: statusBgColor,
    }), [statusBgColor]);

    const statusTextDynamicStyle = useMemo(() => ({
        color: statusColor,
    }), [statusColor]);

    return (
        <TouchableOpacity
            onPress={handlePress} // Usamos la función memorizada
            style={cardStyle}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.statusBadge, statusBadgeDynamicStyle]}>
                        <IconReceptions width={16} height={16} fill={statusColor} />
                        <CustomText style={[styles.statusText, statusTextDynamicStyle]}>
                            {reception.status}
                        </CustomText>
                    </View>
                    <CustomText style={styles.dateText}>
                        {formatDate(reception.reception_date)}
                    </CustomText>
                </View>

                {/* Notes */}
                {reception.notes && (
                    <View style={styles.notesContainer}>
                        <CustomText style={styles.notesText}>
                            "{reception.notes}"
                        </CustomText>
                    </View>
                )}

                {/* User and Provider */}
                <View style={styles.userProviderContainer}>
                    <View style={styles.userInfo}>
                        <IconProfile width={16} height={16} />
                        <View style={{ flex: 1 }}>
                            <CustomText style={styles.infoLabel}>Usuario</CustomText>
                            <CustomText style={styles.infoValue}>{reception.user.name}</CustomText>
                        </View>
                    </View>
                    
                    {reception.provider && (
                        <View style={styles.providerInfo}>
                            <IconProviders width={16} height={16} fill="#6b7280" />
                            <View style={{ flex: 1 }}>
                                <CustomText style={styles.infoLabel}>Proveedor</CustomText>
                                <CustomText style={styles.infoValue}>{reception.provider.name}</CustomText>
                            </View>
                        </View>
                    )}
                </View>

                {/* Items Summary */}
                <View style={styles.itemsSummary}>
                    <View style={styles.itemsInfo}>
                        <IconCart width={16} height={16} fill="#6b7280" />
                        <View>
                            <CustomText style={styles.itemsLabel}>Artículos</CustomText>
                            <CustomText style={styles.itemsValue}>{totalItems}</CustomText>
                        </View>
                    </View>
                    
                    <View style={styles.totalContainer}>
                        <CustomText style={styles.totalLabel}>Total</CustomText>
                        <CustomText style={styles.totalValue}>${totalCost.toFixed(2)}</CustomText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

export default ReceptionCard;