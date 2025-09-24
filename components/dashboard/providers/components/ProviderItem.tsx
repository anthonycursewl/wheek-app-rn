import { Provider } from "@flux/entities/Provider";
import CustomText from "@components/CustomText/CustomText";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export const ProviderItem = ({ item, short = false, onSelectProvider, onClose }: { item: Provider, short?: boolean, onSelectProvider: (item: Provider) => void, onClose?: () => void }) => {
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isActive = item.is_active !== false;
    
    return (
        <TouchableOpacity 
            onPress={() => {
                onSelectProvider(item);
                onClose?.();
            }}
            activeOpacity={0.7}
            style={styles.container}
        >
            <View style={styles.card}>
                {/* Header with avatar and basic info */}
                <View style={styles.header}>
                    <View style={[styles.avatar, { backgroundColor: isActive ? 'rgb(94, 36, 255)' : '#6b7280' }]}>
                        <CustomText style={styles.avatarText}>
                            {item.name.charAt(0).toUpperCase()}
                        </CustomText>
                    </View>
                    
                    <View style={styles.headerContent}>
                        <CustomText style={styles.name}>
                            {item.name}
                        </CustomText>
                        <View style={styles.statusContainer}>
                            <View style={[styles.statusDot, { backgroundColor: isActive ? '#059669' : '#6b7280' }]} />
                            <CustomText style={[styles.status, { color: isActive ? '#059669' : '#6b7280' }]}>
                                {isActive ? 'Activo' : 'Inactivo'}
                            </CustomText>
                        </View>
                    </View>
                </View>
                
                {/* Description */}
                {item.description && (
                    <CustomText style={styles.description}>
                        {item.description}
                    </CustomText>
                )}
                
                {/* Extended info (only when not short) */}
                {!short && (
                    <View style={styles.details}>
                        <View style={styles.detailRow}>
                            <CustomText style={styles.detailLabel}>Creado</CustomText>
                            <CustomText style={styles.detailValue}>
                                {formatDate(item.created_at)}
                            </CustomText>
                        </View>
                        
                        {item.contact_phone && (
                            <View style={styles.detailRow}>
                                <CustomText style={styles.detailLabel}>Teléfono</CustomText>
                                <CustomText style={styles.detailValue}>
                                    {item.contact_phone}
                                </CustomText>
                            </View>
                        )}
                        
                        {item.contact_email && (
                            <View style={styles.detailRow}>
                                <CustomText style={styles.detailLabel}>Email</CustomText>
                                <CustomText style={styles.detailValue}>
                                    {item.contact_email}
                                </CustomText>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    headerContent: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
        marginBottom: 12,
    },
    details: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        marginLeft: 16,
    },
});