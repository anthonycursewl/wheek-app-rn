import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import { colors } from 'shared/constants/manager-store';
import { IconMail } from '@svgs/IconMail';
import { IconPhone } from '@svgs/IconPhone';
import { IconCalendar } from '@svgs/IconCalendar';
import { IconUsers } from '@svgs/IconUsers';
import { IconStore } from '@svgs/IconStore';
import IconArrow from '@svgs/IconArrow';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

const MemberDetail: React.FC = () => {
    const router = useRouter();
    const { member } = useLocalSearchParams();
    
    const memberData: Member = member ? JSON.parse(decodeURIComponent(member as string)) : null;
    
    if (!memberData) {
        return (
            <View style={styles.mainContainer}>
                <CustomText style={styles.errorText}>No se encontró información del miembro</CustomText>
            </View>
        );
    }
    
    const getTextValue = (value: any): string => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && value.name) return value.name;
        if (value && typeof value === 'object' && value.id) return value.id.toString();
        return String(value || '');
    };
    
    const fullName = `${memberData.user.name} ${memberData.user.last_name}`;
    const roleName = memberData.role.name;
    const isActive = memberData.is_active;
    const emailValue = memberData.user.email;
    const phoneValue = memberData.user.username;
    
    const handleBack = () => {
        router.back();
    };
    
    const handleDelete = () => {
        Alert.alert(
            'Eliminar Miembro',
            `¿Estás seguro de que quieres eliminar a ${fullName}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        // Aquí iría la lógica para eliminar el miembro
                        Alert.alert('Éxito', 'Miembro eliminado correctamente');
                        router.back();
                    },
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

    return (
        <View style={styles.mainContainer}>
            <View style={styles.logoContainer}>
                <LogoPage height={60} width={80} />
            </View>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <IconArrow width={24} height={24} fill={colors.dark} />
                    </TouchableOpacity>
                    <CustomText style={styles.headerTitle}>Detalle del Miembro</CustomText>
                    <View style={styles.headerRight} />
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <IconUsers width={48} height={48} fill={colors.primary} />
                        </View>
                        <View style={[styles.statusIndicator, isActive ? styles.activeStatus : styles.inactiveStatus]} />
                    </View>
                    
                    <CustomText style={styles.memberName}>{fullName}</CustomText>
                    <CustomText style={styles.memberRole}>{roleName}</CustomText>
                    
                    <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
                        <CustomText style={styles.statusText}>
                            {isActive ? 'Activo' : 'Inactivo'}
                        </CustomText>
                    </View>
                </View>

                {/* Information Sections */}
                <View style={styles.section}>
                    <CustomText style={styles.sectionTitle}>Información de Contacto</CustomText>
                    
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconMail width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Correo Electrónico</CustomText>
                                <CustomText style={styles.infoValue}>{emailValue}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconPhone width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Nombre de usuario</CustomText>
                                <CustomText style={styles.infoValue}>{phoneValue}</CustomText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <CustomText style={styles.sectionTitle}>Información Laboral</CustomText>
                    
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconUsers width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Rol</CustomText>
                                <CustomText style={styles.infoValue}>{roleName}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconCalendar width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>Fecha de Ingreso</CustomText>
                                <CustomText style={styles.infoValue}>{formatDate(memberData.created_at)}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconStore width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>ID de Miembro</CustomText>
                                <CustomText style={styles.infoValue}>{memberData.id}</CustomText>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.actionSection}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => {
                            Alert.alert('Editar', 'Funcionalidad de edición en desarrollo');
                        }}
                    >
                        <CustomText style={styles.editButtonText}>Editar Miembro</CustomText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <CustomText style={styles.deleteButtonText}>Eliminar Miembro</CustomText>
                    </TouchableOpacity>
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
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
        marginTop: 10,
    },
    backButton: {
        padding: 0
    },
    headerTitle: {
        fontSize: 18,
        color: colors.dark,
    },
    headerRight: {
        width: 40,
    },
    profileCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
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
    activeStatus: {
        backgroundColor: colors.success,
    },
    inactiveStatus: {
        backgroundColor: colors.error,
    },
    memberName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 4,
        textAlign: 'center',
    },
    memberRole: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 12,
        textAlign: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    activeBadge: {
        backgroundColor: `${colors.success}20`,
    },
    inactiveBadge: {
        backgroundColor: `${colors.error}20`,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.dark,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        color: colors.dark,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.lightGray,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 15,
        color: colors.dark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGray,
    },
    actionSection: {
        marginBottom: 40,
    },
    actionButton: {
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    editButton: {
        backgroundColor: colors.primary,
    },
    editButtonText: {
        color: colors.white,
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: `${colors.error}10`,
        borderWidth: 1,
        borderColor: colors.error,
    },
    deleteButtonText: {
        color: colors.error,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default MemberDetail;
