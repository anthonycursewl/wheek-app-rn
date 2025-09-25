import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { colors } from 'shared/constants/manager-store';
import { IconStore } from '@svgs/IconStore';
import { IconInfo } from '@svgs/IconInfo';

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

interface StoreInfoCardProps {
    members: Member[];
}

const StoreInfoCard: React.FC<StoreInfoCardProps> = ({ members }) => {
    const { currentStore } = useGlobalStore();
    
    return (
        <View style={styles.storeInfoCard}>
            <View style={styles.storeInfoHeader}>
                <IconInfo width={24} height={24} fill={colors.primary} />
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

const styles = StyleSheet.create({
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
});

export default StoreInfoCard;
