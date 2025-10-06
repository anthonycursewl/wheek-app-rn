import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useMemberStore } from "@flux/stores/useMemberStore";
import { MemberService } from "@flux/services/Members/MemberService";
import { deleteMemberSuccessAction, getAllMembersAttemptAction, getAllMembersFailureAction, getAllMembersSuccessAction, loadMoreMembersSuccessAction } from "@flux/Actions/MemberActions";
import { colors } from 'shared/constants/manager-store';
import { IconUsers } from '@svgs/IconUsers';
import { IconStore } from '@svgs/IconStore';
import MembersContent from '@components/dashboard/members/MembersContent';
import CashiersContent from '@components/dashboard/members/CashiersContent';
import { dashboardStyles } from '@components/dashboard/members/styles';

export default function ManageMembers() {
    const { currentStore } = useGlobalStore();
    const { 
        members, 
        loading, 
        error,
        take,
        hasMore,
        dispatch
    } = useMemberStore();
    
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'members' | 'cashiers'>('members');
    const isFetching = useRef(false);
    const hasMounted = useRef(false);

    const loadMembers = useCallback(async (isRefresh = false) => {
        if (!currentStore?.id || isFetching.current) return;
        
        isFetching.current = true;
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
            
        if (error) dispatch(getAllMembersFailureAction(error)); 
        if (data) {
            console.log('API Response Data:', data);    
            const actionType = isRefresh ? getAllMembersSuccessAction(data) : loadMoreMembersSuccessAction(data);
            dispatch(actionType);
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
        }
    };

    useEffect(() => {
        console.log(`Aquí están los miembros de la tienda chota mia: ${JSON.stringify(members)}`)
    }, [members]);

    return (
        <View style={dashboardStyles.container}>
            {/* Header */}
            <View style={dashboardStyles.header}>
                <View style={dashboardStyles.headerContent}>
                    <View style={{ alignItems: 'center' }}>
                        <LogoPage width={80} height={60} />
                    </View>
                    <CustomText style={dashboardStyles.headerTitle}>Gestión</CustomText>
                </View>
            </View>

            <View style={dashboardStyles.tabContainer}>
                <TouchableOpacity 
                    style={[dashboardStyles.tab, activeTab === 'members' && dashboardStyles.activeTab]}
                    onPress={() => setActiveTab('members')}
                >
                    <IconUsers width={20} height={20} fill={activeTab === 'members' ? colors.white : colors.primary} />
                    <CustomText style={[dashboardStyles.tabText, activeTab === 'members' ? dashboardStyles.activeTabText : {}]}>
                        Miembros
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[dashboardStyles.tab, activeTab === 'cashiers' && dashboardStyles.activeTab]}
                    onPress={() => setActiveTab('cashiers')}
                >
                    <IconStore width={20} height={20} fill={activeTab === 'cashiers' ? colors.white : colors.primary} />
                    <CustomText style={[dashboardStyles.tabText, activeTab === 'cashiers' ? dashboardStyles.activeTabText : {}]}>
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
                    hasMore={hasMore}
                />
            ) : (
                <CashiersContent />
            )}
        </View>
    );
}
