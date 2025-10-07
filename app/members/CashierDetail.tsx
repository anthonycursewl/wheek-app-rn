import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import CustomText from '@components/CustomText/CustomText';
import LogoPage from '@components/LogoPage/LogoPage';
import { colors } from 'shared/constants/manager-store';
import { IconMail } from '@svgs/IconMail';
import { IconPhone } from '@svgs/IconPhone';
import { IconCalendar } from '@svgs/IconCalendar';
import { IconStore } from '@svgs/IconStore';
import IconArrow from '@svgs/IconArrow';
import { IconCart } from '@svgs/IconCart';

interface Cashier {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'Cajero' | 'Supervisor de Caja' | 'Administrador de Caja';
    joinedAt: string;
    status: 'active' | 'inactive';
    cashierCode: string;
    salesCount: number;
    totalSales: number;
    lastSaleDate?: string;
    permissions: string[];
}

interface CashierDetailProps {
    cashier: Cashier;
    onBack: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewSales?: () => void;
}

const CashierDetail: React.FC<CashierDetailProps> = ({ 
    cashier, 
    onBack, 
    onEdit,
    onDelete,
    onViewSales
}) => {
    
    const handleDelete = () => {
        Alert.alert(
            'Eliminar Cajero',
            `¿Estás seguro de que quieres eliminar a ${cashier.name}? Esta acción no se puede deshacer.`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: onDelete,
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusColor = (status: 'active' | 'inactive') => {
        return status === 'active' ? colors.success : colors.error;
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Administrador de Caja':
                return colors.primary;
            case 'Supervisor de Caja':
                return '#FF9500';
            case 'Cajero':
                return '#34C759';
            default:
                return colors.gray;
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.logoContainer}>
                <LogoPage height={60} width={80} />
            </View>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <IconArrow width={24} height={24} fill={colors.dark} />
                    </TouchableOpacity>
                    <CustomText style={styles.headerTitle}>Detalle del Cajero</CustomText>
                    <View style={styles.headerRight} />
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <IconCart width={48} height={48} fill={colors.primary} />
                        </View>
                        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(cashier.status) }]} />
                    </View>
                    
                    <CustomText style={styles.cashierName}>{cashier.name}</CustomText>
                    <View style={styles.roleContainer}>
                        <CustomText style={[styles.cashierRole, { color: getRoleColor(cashier.role) }]}>
                            {cashier.role}
                        </CustomText>
                    </View>
                    
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cashier.status) + '20' }]}>
                        <CustomText style={[styles.statusText, { color: getStatusColor(cashier.status) }]}>
                            {cashier.status === 'active' ? 'Activo' : 'Inactivo'}
                        </CustomText>
                    </View>

                    {/* Cashier Code */}
                    <View style={styles.codeContainer}>
                        <CustomText style={styles.codeLabel}>Código de Cajero</CustomText>
                        <CustomText style={styles.codeValue}>{cashier.cashierCode}</CustomText>
                    </View>
                </View>

                {/* Sales Stats */}
                <View style={styles.section}>
                    <CustomText style={styles.sectionTitle}>Estadísticas de Ventas</CustomText>
                    
                    <View style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <CustomText style={styles.statValue}>{cashier.salesCount}</CustomText>
                                <CustomText style={styles.statLabel}>Ventas Totales</CustomText>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <CustomText style={styles.statValue}>{formatCurrency(cashier.totalSales)}</CustomText>
                                <CustomText style={styles.statLabel}>Monto Total</CustomText>
                            </View>
                        </View>
                        
                        {cashier.lastSaleDate && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.lastSaleContainer}>
                                    <CustomText style={styles.lastSaleLabel}>Última Venta:</CustomText>
                                    <CustomText style={styles.lastSaleValue}>
                                        {formatDate(cashier.lastSaleDate)}
                                    </CustomText>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Information Sections */}
                <View style={styles.section}>
                    <CustomText style={styles.sectionTitle}>Información Personal</CustomText>
                    
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconMail width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Correo Electrónico</CustomText>
                                <CustomText style={styles.infoValue}>{cashier.email}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconPhone width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Teléfono</CustomText>
                                <CustomText style={styles.infoValue}>{cashier.phone}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconCalendar width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Fecha de Ingreso</CustomText>
                                <CustomText style={styles.infoValue}>{formatDate(cashier.joinedAt)}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconStore width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>ID de Cajero</CustomText>
                                <CustomText style={styles.infoValue}>{cashier.id}</CustomText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Permissions */}
                <View style={styles.section}>
                    <CustomText style={styles.sectionTitle}>Permisos</CustomText>
                    
                    <View style={styles.permissionsCard}>
                        {cashier.permissions.map((permission, index) => (
                            <View key={index} style={styles.permissionItem}>
                                <View style={styles.permissionDot} />
                                <CustomText style={styles.permissionText}>{permission}</CustomText>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    {onViewSales && (
                        <TouchableOpacity style={styles.salesButton} onPress={onViewSales}>
                            <IconCart width={20} height={20} fill={colors.white} />
                            <CustomText style={styles.salesButtonText}>Ver Ventas</CustomText>
                        </TouchableOpacity>
                    )}
                    
                    {onEdit && (
                        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                            <CustomText style={styles.editButtonText}>Editar Cajero</CustomText>
                        </TouchableOpacity>
                    )}
                    
                    {onDelete && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <CustomText style={styles.deleteButtonText}>Eliminar Cajero</CustomText>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    logoContainer: {
        backgroundColor: colors.white,
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
    },
    headerRight: {
        width: 40,
    },
    profileCard: {
        backgroundColor: colors.white,
        margin: 16,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: colors.white,
    },
    cashierName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 4,
    },
    roleContainer: {
        marginBottom: 12,
    },
    cashierRole: {
        fontSize: 16,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    codeContainer: {
        backgroundColor: colors.lightGray,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 2,
    },
    codeValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        fontFamily: 'monospace',
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 12,
    },
    statsCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        padding: 16,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: colors.lightGray,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGray,
        marginVertical: 12,
    },
    lastSaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastSaleLabel: {
        fontSize: 14,
        color: colors.gray,
    },
    lastSaleValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: colors.dark,
        fontWeight: '500',
    },
    permissionsCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        padding: 16,
    },
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    permissionDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginRight: 12,
    },
    permissionText: {
        fontSize: 14,
        color: colors.dark,
        flex: 1,
    },
    actionsContainer: {
        marginHorizontal: 16,
        marginBottom: 32,
        gap: 12,
    },
    salesButton: {
        backgroundColor: colors.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    salesButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    editButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    editButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: colors.error + '10',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.error + '20',
    },
    deleteButtonText: {
        color: colors.error,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CashierDetail;
