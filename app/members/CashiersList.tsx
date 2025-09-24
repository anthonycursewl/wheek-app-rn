import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useCashierStore } from "@flux/stores/useCashierStore";
import { CashierService } from "@flux/services/Cashiers/CashierService";
import { CashierActions } from "@flux/Actions/CashierActions";
import { colors } from 'shared/constants/manager-store';
import { IconUsers } from '@svgs/IconUsers';
import { IconPlus } from '@svgs/IconPlus';
import { IconCart } from '@svgs/IconCart';
import { IconCalendar } from '@svgs/IconCalendar';
import CashierDetail from './CashierDetail';

interface Cashier {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'Cajero' | 'Supervisor de Caja' | 'Administrador de Caja';
    joinedAt: string;
    status: 'active' | 'inactive';
    cashierCode: string;
    totalSales: number;
    lastSaleDate?: string;
    permissions: string[];
}

const CashierCard = ({ cashier, onPress }: { cashier: Cashier; onPress: () => void }) => {
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

    const getStatusColor = (status: 'active' | 'inactive') => {
        return status === 'active' ? colors.success : colors.error;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <TouchableOpacity style={styles.cashierCard} onPress={onPress}>
            <View style={styles.cashierHeader}>
                <View style={styles.cashierInfo}>
                    <View style={styles.avatarContainer}>
                        <IconCart width={32} height={32} fill={colors.primary} />
                        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(cashier.status) }]} />
                    </View>
                    <View style={styles.cashierDetails}>
                        <CustomText style={styles.cashierName}>{cashier.name}</CustomText>
                        <CustomText style={[styles.cashierRole, { color: getRoleColor(cashier.role) }]}>
                            {cashier.role}
                        </CustomText>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cashier.status) + '20' }]}>
                    <CustomText style={[styles.statusText, { color: getStatusColor(cashier.status) }]}>
                        {cashier.status === 'active' ? 'Activo' : 'Inactivo'}
                    </CustomText>
                </View>
            </View>
            
            <View style={styles.cashierStats}>
                <View style={styles.statItem}>
                    <CustomText style={styles.statValue}>{cashier.totalSales.toFixed(2)}</CustomText>
                    <CustomText style={styles.statLabel}>Ventas</CustomText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <CustomText style={styles.statValue}>{formatCurrency(cashier.totalSales)}</CustomText>
                    <CustomText style={styles.statLabel}>Total</CustomText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <CustomText style={styles.codeValue}>{cashier.cashierCode}</CustomText>
                    <CustomText style={styles.statLabel}>Código</CustomText>
                </View>
            </View>

            {cashier.lastSaleDate && (
                <View style={styles.lastSaleContainer}>
                    <IconCalendar width={14} height={14} fill={colors.gray} />
                    <CustomText style={styles.lastSaleText}>
                        Última venta: {new Date(cashier.lastSaleDate).toLocaleDateString('es-ES')}
                    </CustomText>
                </View>
            )}
        </TouchableOpacity>
    );
};

interface CashiersListProps {
    onAddCashier?: () => void;
}

const CashiersList: React.FC<CashiersListProps> = ({ onAddCashier }) => {
    const { currentStore } = useGlobalStore();
    const { 
        cashiers, 
        loading, 
        error, 
        dispatch,
        selectedCashier,
        setSelectedCashier
    } = useCashierStore();
    
    const [refreshing, setRefreshing] = useState(false);
    const isFetching = useRef(false);
    const hasMounted = useRef(false);

    const loadCashiers = useCallback(async (isRefresh = false) => {
        if (!currentStore?.id || isFetching.current) return;
        
        isFetching.current = true;
        
        try {
            if (isRefresh) {
                dispatch({ type: CashierActions.GET_ALL_CASHIERS_ATTEMPT });
            }
            
            const response = await CashierService.getAllCashiers(
                currentStore.id,
                0,
                50,
                ''
            );
            
            if (response.error) {
                dispatch({ 
                    type: CashierActions.GET_ALL_CASHIERS_FAILURE, 
                    payload: { error: response.error } 
                });
            } else {
                dispatch({ 
                    type: CashierActions.GET_ALL_CASHIERS_SUCCESS, 
                    payload: { response: response.data || [] } 
                });
            }
        } catch (error) {
            dispatch({ 
                type: CashierActions.GET_ALL_CASHIERS_FAILURE, 
                payload: { error: 'Error al cargar cajeros' } 
            });
        } finally {
            isFetching.current = false;
        }
    }, [currentStore?.id, dispatch]);

    useEffect(() => {
        if (!hasMounted.current && currentStore?.id) {
            hasMounted.current = true;
            loadCashiers();
        }
    }, [loadCashiers, currentStore?.id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadCashiers(true);
        setRefreshing(false);
    };

    const handleBack = () => {
        setSelectedCashier(null);
    };

    const handleEditCashier = () => {
        Alert.alert('Editar Cajero', 'Funcionalidad de edición próximamente');
    };

    const handleDeleteCashier = async () => {
        if (selectedCashier && currentStore?.id) {
            try {
                const response = await CashierService.deleteCashier(
                    selectedCashier.id,
                    currentStore.id
                );
                
                if (response.error) {
                    Alert.alert('Error', response.error);
                } else {
                    dispatch({ 
                        type: CashierActions.DELETE_CASHIER_SUCCESS, 
                        payload: { response: selectedCashier } 
                    });
                    setSelectedCashier(null);
                    Alert.alert('Éxito', 'Cajero eliminado correctamente');
                }
            } catch (error) {
                Alert.alert('Error', 'Error al eliminar cajero');
            }
        }
    };

    const handleViewSales = () => {
        if (selectedCashier) {
            Alert.alert('Ver Ventas', `Mostrando ventas de ${selectedCashier.name}`);
        }
    };

    const renderCashierItem = ({ item }: { item: any }) => (
        <CashierCard cashier={item} onPress={() => setSelectedCashier(item)} />
    );

    // Si hay un cajero seleccionado, mostrar la vista de detalle
    if (selectedCashier) {
        return (
            <CashierDetail
                cashier={selectedCashier}
                onBack={handleBack}
                onEdit={handleEditCashier}
                onDelete={handleDeleteCashier}
                onViewSales={handleViewSales}
            />
        );
    }

    const activeCashiers = cashiers.filter(c => c.status === 'active').length;
    const totalSales = cashiers.reduce((sum, cashier) => sum + cashier.totalSales, 0);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <IconUsers width={20} height={20} fill={colors.primary} />
                    <CustomText style={styles.headerTitle}>Cajas de la Tienda</CustomText>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={onAddCashier}>
                    <IconPlus width={20} height={20} fill={colors.white} />
                </TouchableOpacity>
            </View>

            {/* Stats Summary */}
            <View style={styles.statsSummary}>
                <View style={styles.summaryCard}>
                    <CustomText style={styles.summaryValue}>{cashiers.length}</CustomText>
                    <CustomText style={styles.summaryLabel}>Total Cajas</CustomText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryCard}>
                    <CustomText style={styles.summaryValue}>{activeCashiers}</CustomText>
                    <CustomText style={styles.summaryLabel}>Activas</CustomText>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryCard}>
                    <CustomText style={styles.summaryValue}>
                        {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(totalSales)}
                    </CustomText>
                    <CustomText style={styles.summaryLabel}>Ventas Totales</CustomText>
                </View>
            </View>

            {/* Cashiers List */}
            <View style={styles.listContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <CustomText style={styles.loadingText}>Cargando cajas...</CustomText>
                    </View>
                ) : cashiers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <IconCart width={48} height={48} fill={colors.gray} />
                        <CustomText style={styles.emptyText}>
                            No hay cajas registradas
                        </CustomText>
                        <CustomText style={styles.emptySubtext}>
                            Agrega nuevas cajas para empezar a gestionar ventas
                        </CustomText>
                    </View>
                ) : (
                    <View style={styles.listContent}>
                        {cashiers.map((cashier, index) => (
                            <React.Fragment key={cashier.id}>
                                {renderCashierItem({ item: cashier })}
                                {index < cashiers.length - 1 && <View style={styles.separator} />}
                            </React.Fragment>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginTop: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
    },
    addButton: {
        backgroundColor: colors.primary,
        borderRadius: 100,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsSummary: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    summaryCard: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 2,
    },
    summaryLabel: {
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: colors.lightGray,
    },
    listContainer: {
        flex: 1,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.gray,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.dark,
        fontWeight: '500',
    },
    emptySubtext: {
        marginTop: 4,
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    listContent: {
        padding: 16,
    },
    separator: {
        height: 12,
    },
    cashierCard: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cashierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cashierInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: colors.background,
    },
    cashierDetails: {
        flex: 1,
    },
    cashierName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 2,
    },
    cashierRole: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    cashierStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: colors.gray,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.lightGray,
    },
    codeValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        fontFamily: 'monospace',
    },
    lastSaleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lastSaleText: {
        fontSize: 11,
        color: colors.gray,
        flex: 1,
    },
});

export default CashiersList;
