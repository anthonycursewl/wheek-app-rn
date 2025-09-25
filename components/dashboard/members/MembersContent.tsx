import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList } from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import { colors } from 'shared/constants/manager-store';
import { IconUsers } from '@svgs/IconUsers';
import { IconPlus } from '@svgs/IconPlus';
import MemberCard from './MemberCard';
import StoreInfoCard from './StoreInfoCard';
import { useRouter } from 'expo-router';
import { IconMember } from '@svgs/IconMember';

interface User {
    name: string;
    last_name: string;
    username: string;
    email: string;
    icon_url: string | null;
}

interface Role {
    id: string;
    name: string;
}

interface Member {
    id: string;
    user_id: string;
    store_id: string;
    role_id: string;
    is_active: boolean;
    created_at: string;
    user: User;
    role: Role;
}

interface MembersContentProps {
    members: Member[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    onRefresh: () => void;
    onLoadMore: () => void;
    hasMore: boolean;
}

const MembersContent: React.FC<MembersContentProps> = ({
    members,
    loading,
    error,
    refreshing,
    onRefresh,
    onLoadMore,
    hasMore
}) => {
    const router = useRouter();
    const renderMemberItem = ({ item }: { item: Member }) => (
        <MemberCard 
            member={item} 
            onPress={() => {
                router.push({
                    pathname: '/members/MemberDetail',
                    params: { member: encodeURIComponent(JSON.stringify(item)) }
                });
            }} 
        />
    );

    return (
        <View style={styles.contentContainer}>
            <StoreInfoCard members={members} />
            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                        <IconMember width={25} height={25} fill={colors.primary} />
                        <CustomText style={styles.sectionTitle}>
                            Miembros de la Tienda
                        </CustomText>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => router.push('/members/invite')}>
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
                        keyExtractor={(item: Member) => item.id}
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

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
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
        justifyContent: 'center',
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
});

export default MembersContent;
