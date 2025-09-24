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

interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    joinedAt: string;
    status: 'active' | 'inactive';
}

interface MemberDetailProps {
    member: Member;
    onBack: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({ 
    member, 
    onBack, 
    onEdit,
    onDelete 
}) => {
    // Función helper para obtener el valor de texto de una propiedad que podría ser objeto o string
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
    
    const handleDelete = () => {
        Alert.alert(
            'Eliminar Miembro',
            `¿Estás seguro de que quieres eliminar a ${member.name}?`,
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
                    
                    <CustomText style={styles.memberName}>{member.name}</CustomText>
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
                                <CustomText style={styles.infoLabel}>Teléfono</CustomText>
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
                                <CustomText style={styles.infoValue}>{formatDate(getTextValue(member.joinedAt))}</CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <IconStore width={20} height={20} fill={colors.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <CustomText style={styles.infoLabel}>ID de Miembro</CustomText>
                                <CustomText style={styles.infoValue}>{member.id}</CustomText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    {onEdit && (
                        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                            <CustomText style={styles.editButtonText}>Editar Miembro</CustomText>
                        </TouchableOpacity>
                    )}
                    
                    {onDelete && (
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <CustomText style={styles.deleteButtonText}>Eliminar Miembro</CustomText>
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
    activeStatus: {
        backgroundColor: colors.success,
    },
    inactiveStatus: {
        backgroundColor: colors.error,
    },
    memberName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 4,
    },
    memberRole: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: colors.success + '20',
    },
    inactiveBadge: {
        backgroundColor: colors.error + '20',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
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
    divider: {
        height: 1,
        backgroundColor: colors.lightGray,
        marginHorizontal: 16,
    },
    actionsContainer: {
        marginHorizontal: 16,
        marginBottom: 32,
        gap: 12,
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

export default MemberDetail;
