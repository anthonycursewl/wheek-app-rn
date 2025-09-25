import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import { colors } from 'shared/constants/manager-store';
import { IconMail } from '@svgs/IconMail';
import { IconPhone } from '@svgs/IconPhone';
import { IconCalendar } from '@svgs/IconCalendar';

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

interface MemberCardProps {
    member: Member;
    onPress: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
    const fullName = `${member.user.name} ${member.user.last_name}`;
    const roleName = member.role.name;
    const isActive = member.is_active;
    const emailValue = member.user.email;
    const phoneValue = member.user.username; // Using username as phone since phone is not available
    const joinedAtValue = member.created_at;
    
    return (
    <TouchableOpacity style={styles.memberCard} onPress={onPress}>
        <View style={styles.memberHeader}>
            <View style={styles.memberInfo}>
                <View style={{ marginBottom: 10 }}>

                    <CustomText style={styles.memberName}>{fullName}</CustomText>
                    <CustomText style={styles.memberUsername}>@{member.user.username}</CustomText>
                </View>
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
                <IconCalendar width={16} height={16} fill={colors.gray} />
                <CustomText style={styles.detailText}>
                    Miembro desde: {new Date(joinedAtValue).toLocaleDateString('es-ES')}
                </CustomText>
            </View>
        </View>
    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
    },
    memberUsername: {
        fontSize: 14,
        color: colors.gray,
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
});

export default MemberCard;
