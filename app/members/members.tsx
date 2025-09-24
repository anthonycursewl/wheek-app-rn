import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    FlatList
} from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useMemberStore } from "@flux/stores/useMemberStore";
import { MemberService } from "@flux/services/Members/MemberService";
import { deleteMemberSuccessAction, getAllMembersAttemptAction, getAllMembersFailureAction, getAllMembersSuccessAction, loadMoreMembersSuccessAction } from "@flux/Actions/MemberActions";
import { colors } from 'shared/constants/manager-store';
import { IconPlus } from '@svgs/IconPlus';
import { IconUsers } from '@svgs/IconUsers';
import { IconStore } from '@svgs/IconStore';
import { IconMail } from '@svgs/IconMail';
import { IconPhone } from '@svgs/IconPhone';
import { IconCalendar } from '@svgs/IconCalendar';
import MemberDetail from './MemberDetail';
import CashiersList from './CashiersList';


interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    joinedAt: string;
    status: 'active' | 'inactive';
}

const MemberCard = ({ member, onPress }: { member: Member; onPress: () => void }) => {
    const getTextValue = (value: any): string => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && value.name) return value.name;
        if (value && typeof value === 'object' && value.id) return value.id.toString();
        return String(value || '');
    };
    
    const roleName = getTextValue(member.role);
    const statusValue = getTextValue(member.status);
    const isActive = statusValue.toLowerCase() === 'active';
    const emailValue = getTextValue(member.email);
    const phoneValue = getTextValue(member.phone);
    const joinedAtValue = getTextValue(member.joinedAt);
    
    return (
    <TouchableOpacity style={styles.memberCard} onPress={onPress}>
        <View style={styles.memberHeader}>
            <View style={styles.memberInfo}>
                <CustomText style={styles.memberName}>{member.name}</CustomText>
                <CustomText style={styles.memberRole}>{roleName}</CustomText>
            </View>
            <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
                <CustomText style={styles.statusText}>
                    {isActive ? 'Activo' : 'Inactivo'}
                </CustomText>
            </View>
        </View>
        
        <View style={styles.memberDetails}>
            <View style={styles.detailRow}>
                <IconMail width={16} height={16} fill={colors.gray} />
                <CustomText style={styles.detailText}>{emailValue}</CustomText>
            </View>
            <View style={styles.detailRow}>
                <IconPhone width={16} height={16} fill={colors.gray} />
                <CustomText style={styles.detailText}>{phoneValue}</CustomText>
            </View>
            <View style={styles.detailRow}>
                <IconCalendar width={16} height={16} fill={colors.gray} />
                <CustomText style={styles.detailText}>
                    Miembro desde: {new Date(joinedAtValue).toLocaleDateString('es-ES')}
                </CustomText>
            </View>
        </View>
    </TouchableOpacity>
    );
};

const StoreInfoCard = ({ members }: { members: Member[] }) => {
    const { currentStore } = useGlobalStore();
    
    return (
        <View style={styles.storeInfoCard}>
            <View style={styles.storeInfoHeader}>
                <IconStore width={24} height={24} fill={colors.primary} />
                <CustomText style={styles.storeInfoTitle}>Información de la Tienda</CustomText>
            </View>
            
            <View style={styles.storeInfoContent}>
                <View style={styles.infoRow}>
                    <CustomText style={styles.infoLabel}>Nombre:</CustomText>
                    <CustomText style={styles.infoValue}>{currentStore?.name || 'Sin nombre'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                    <CustomText style={styles.infoLabel}>Descripción:</CustomText>
                    <CustomText style={styles.infoValue}>
                        {currentStore?.description || 'Sin descripción'}
                    </CustomText>
                </View>
                <View style={styles.infoRow}>
                    <CustomText style={styles.infoLabel}>ID:</CustomText>
                    <CustomText style={styles.infoValue}>{currentStore?.id || 'N/A'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                    <CustomText style={styles.infoLabel}>Total Miembros:</CustomText>
                    <CustomText style={styles.infoValue}>{members.length}</CustomText>
                </View>
            </View>
        </View>
    );
};

const CashiersSection = () => {
    const handleAddCashier = () => {
        Alert.alert('Agregar Cajero', 'Funcionalidad para agregar nuevos cajeros próximamente');
    };
    
    return (
        <CashiersList onAddCashier={handleAddCashier} />
    );
};

// Componente para el contenido de Miembros
const MembersContent = ({
    members,
    loading,
    error,
    refreshing,
    onRefresh,
    onLoadMore,
    onMemberPress,
    hasMore
}: {
    members: any[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    onRefresh: () => void;
    onLoadMore: () => void;
    onMemberPress: (member: any) => void;
    hasMore: boolean;
}) => {
    const renderMemberItem = ({ item }: { item: any }) => (
        <MemberCard member={item} onPress={() => onMemberPress(item)} />
    );

    return (
        <View style={styles.contentContainer}>
            <StoreInfoCard members={members} />
            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <IconUsers width={20} height={20} fill={colors.primary} />
                        <CustomText style={styles.sectionTitle}>
                            Miembros de la Tienda
                        </CustomText>
                    </View>
                    <TouchableOpacity style={styles.addButton}>
                        <IconPlus width={20} height={20} fill={colors.white} />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <CustomText style={styles.loadingText}>Cargando miembros...</CustomText>
                    </View>
                ) : error ? (
                    <View style={styles.emptyContainer}>
                        <IconUsers width={48} height={48} fill={colors.error} />
                        <CustomText style={styles.emptyText}>Error al cargar miembros</CustomText>
                        <CustomText style={styles.emptySubtext}>{error}</CustomText>
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={onRefresh}
                        >
                            <CustomText style={styles.retryButtonText}>Reintentar</CustomText>
                        </TouchableOpacity>
                    </View>
                ) : members.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <IconUsers width={48} height={48} fill={colors.gray} />
                        <CustomText style={styles.emptyText}>
                            No hay miembros en esta tienda
                        </CustomText>
                        <CustomText style={styles.emptySubtext}>
                            Agrega nuevos miembros para empezar
                        </CustomText>
                    </View>
                ) : (
                    <FlatList
                        data={members}
                        renderItem={renderMemberItem}
                        keyExtractor={(item: any) => item.id}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        onEndReached={onLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => (
                            loading && members.length > 0 ? (
                                <View style={styles.footerLoading}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                    <CustomText style={styles.footerLoadingText}>Cargando más...</CustomText>
                                </View>
                            ) : null
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

// Componente para el contenido de Cajeros
const CashiersContent = () => {
    const handleAddCashier = () => {
        Alert.alert('Agregar Cajero', 'Funcionalidad para agregar nuevos cajeros próximamente');
    };

    return (
        <View style={styles.contentContainer}>
            <CashiersList onAddCashier={handleAddCashier} />
        </View>
    );
};

export default function ManageMembers() {
    const { currentStore } = useGlobalStore();
    const { 
        members, 
        loading, 
        error, 
        hasMore,
        dispatch,
        selectedMember,
        setSelectedMember
    } = useMemberStore();
    
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'members' | 'cashiers'>('members');
    const isFetching = useRef(false);
    const hasMounted = useRef(false);

    const loadMembers = useCallback(async (isRefresh = false) => {
        if (!currentStore?.id || isFetching.current) return;
        
        isFetching.current = true;
        
        try {
            if (isRefresh) {
                dispatch(getAllMembersAttemptAction());
            }
            
            const skip = isRefresh ? 0 : members.length;
            const take = 10;
            
            const { data, error } = await MemberService.getAllMembers(
                currentStore.id,
                skip,
                take,
                ''
            );
            
            if (error) {
                dispatch(getAllMembersFailureAction(error));
            } 
            if (data) {
                console.log('API Response Data:', data);
                
                const actionType = isRefresh 
                    ? getAllMembersSuccessAction(data)
                    : loadMoreMembersSuccessAction(data);
                    
                dispatch(actionType);
            }
        } catch (error) {
            dispatch(getAllMembersFailureAction(error as string));
        } finally {
            isFetching.current = false;
        }
    }, [currentStore?.id, dispatch, members.length]);

    useEffect(() => {
        if (!hasMounted.current && currentStore?.id) {
            hasMounted.current = true;
            loadMembers();
        }
    }, [loadMembers, currentStore?.id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadMembers(true);
        setRefreshing(false);
    };

    const handleLoadMore = async () => {
        if (!loading && !isFetching.current && hasMore) {
            await loadMembers(false);
        }
    };

    const renderMemberItem = ({ item }: { item: any }) => (
        <MemberCard member={item} onPress={() => setSelectedMember(item)} />
    );

    const handleBack = () => {
        setSelectedMember(null);
    };

    const handleEditMember = () => {
        Alert.alert('Editar Miembro', 'Funcionalidad de edición próximamente');
    };

    const handleDeleteMember = async () => {
        if (selectedMember && currentStore?.id) {
            try {
                const response = await MemberService.deleteMember(
                    selectedMember.id,
                    currentStore.id
                );
                
                if (response.error) {
                    Alert.alert('Error', response.error);
                } else {
                    dispatch(deleteMemberSuccessAction(selectedMember));
                    setSelectedMember(null);
                    Alert.alert('Éxito', 'Miembro eliminado correctamente');
                }
            } catch (error) {
                Alert.alert('Error', 'Error al eliminar miembro');
            }
        }
    };

    // Si hay un miembro seleccionado, mostrar la vista de detalle
    if (selectedMember) {
        return (
            <MemberDetail
                member={selectedMember}
                onBack={handleBack}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={{ alignItems: 'center' }}>
                        <LogoPage width={80} height={60} />
                    </View>
                    <CustomText style={styles.headerTitle}>Gestión</CustomText>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'members' && styles.activeTab]}
                    onPress={() => setActiveTab('members')}
                >
                    <IconUsers width={20} height={20} fill={activeTab === 'members' ? colors.white : colors.primary} />
                    <CustomText style={[styles.tabText, activeTab === 'members' ? styles.activeTabText : {}]}>
                        Miembros
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'cashiers' && styles.activeTab]}
                    onPress={() => setActiveTab('cashiers')}
                >
                    <IconStore width={20} height={20} fill={activeTab === 'cashiers' ? colors.white : colors.primary} />
                    <CustomText style={[styles.tabText, activeTab === 'cashiers' ? styles.activeTabText : {}]}>
                        Cajeros
                    </CustomText>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {activeTab === 'members' ? (
                <MembersContent 
                    members={members}
                    loading={loading}
                    error={error}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onLoadMore={handleLoadMore}
                    onMemberPress={(member) => setSelectedMember(member)}
                    hasMore={hasMore}
                />
            ) : (
                <CashiersContent />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 22,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    storeInfoCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    storeInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    storeInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
    },
    storeInfoContent: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    infoLabel: {
        fontSize: 14,
        color: colors.gray,
        fontWeight: '500',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: colors.dark,
        fontWeight: '400',
        flex: 2,
        textAlign: 'right',
    },
    section: {
        marginTop: 24,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
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
    },
    memberCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    memberHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 2,
    },
    memberRole: {
        fontSize: 14,
        color: colors.gray,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: `${colors.success}20`,
    },
    inactiveBadge: {
        backgroundColor: `${colors.error}20`,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    memberDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: colors.dark,
        flex: 1,
    },
    retryButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        height: 12,
    },
    footerLoading: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    footerLoadingText: {
        fontSize: 14,
        color: colors.gray,
    },
    // Estilos para los tabs
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
        backgroundColor: colors.white,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
    },
    activeTabText: {
        color: colors.white,
    },
    // Estilos para el contenedor de contenido
    contentContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
});