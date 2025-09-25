import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from "@components/CustomText/CustomText";
import Input from "@components/Input/Input";
import Button from "@components/Buttons/Button";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { colors } from 'shared/constants/manager-store';
import { IconMail } from '@svgs/IconMail';
import { IconMember } from '@svgs/IconMember';
import { IconRoles } from '@svgs/IconRoles';
import { dashboardStyles } from '@components/dashboard/members/styles';
import { useMemberStore } from '@flux/stores/useMemberStore';
import ModalOptions from '@components/Modals/ModalOptions';
import ListRoles from '@components/dashboard/roles/components/ListRoles';
import LogoPage from '@components/LogoPage/LogoPage';
import { IconInfo } from '@svgs/IconInfo';
import { memberAttemptAction, memberFailureAction } from '@flux/Actions/MemberActions';
import { MemberService } from '@flux/services/Members/MemberService';
import CustomAlert from 'shared/components/CustomAlert';
import { router } from 'expo-router';

interface UserInvited {
    email: string;
    name: string;
    role_id: string;
    message: string;
}

export default function InviteMembers() {
    const { currentStore, alertState, showResponse, showSuccess, hideAlert } = useGlobalStore();
    const [userInvited, setUserInvited] = useState<UserInvited>({ email: '', name: '', role_id: '', message: '' });
    const [selectedRole, setSelectedRole] = useState<{ id: string; name: string }>({ id: '', name: '' });
    const [showModal, setShowModal] = useState(false);
    const { dispatch, loading } = useMemberStore()

    const validateForm = (): string | null => {
        if (!userInvited?.name.trim()) {
            return 'El nombre es requerido';
        }
        
        if (!userInvited?.email.trim()) {
            return 'El email es requerido';
        } 
        
        return null;
    };

    const handleInvite = async () => {
        if (validateForm() || loading) { 
            showResponse(validateForm() || 'Cargando...', { icon: 'error' });
            return; 
        };
        
        if (!currentStore?.id) {
            Alert.alert('Error', 'No se encontró información de la tienda');
            return;
        }
        
        dispatch(memberAttemptAction())
        const { data, error} = await MemberService.createInvitation(userInvited?.email || '', selectedRole.id, currentStore.id, userInvited?.message || '')
        
        if (error) {
            dispatch(memberFailureAction(error));
            showResponse(error, { icon: 'error' });
        } 
        if (data) {
            dispatch(memberFailureAction(''));
            showSuccess('¡La invitación se envió correctamente!', { icon: 'success' });
            setTimeout(() => router.back(), 2000);
        }
    }

    return (
        <>
        <View style={dashboardStyles.container}>
            <ScrollView style={{ flex: 1 }}>
            {/* Header */}
            <View style={dashboardStyles.header}>
                <View style={dashboardStyles.headerContent}>
                    <LogoPage height={25}/>
                    <CustomText style={dashboardStyles.headerTitle}>Invitar Miembros</CustomText>
                </View>
            </View>

            {/* Formulario */}
                <View style={styles.formCard}>
                    <CustomText style={styles.formTitle}>Nueva Invitación</CustomText>
                    <CustomText style={styles.formSubtitle}>
                        Envía una invitación para que nuevos miembros se unan a tu tienda
                    </CustomText>

                    {/* Campo de Nombre */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIcon}>
                            <IconMember width={20} height={20} fill={colors.primary} />
                        </View>
                        <Input
                            placeholder="Nombre completo"
                            value={userInvited?.name || ''}
                            onChangeText={name => setUserInvited(userInvited ? { ...userInvited, name } : { name, email: '', role_id: selectedRole.id, message: '' })}
                            style={styles.input}
                        />
                    </View>

                    {/* Campo de Email */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIcon}>
                            <IconMail width={20} height={20} fill={colors.primary} />
                        </View>
                        <Input
                            placeholder="Email del miembro"
                            value={userInvited?.email || ''}
                            onChangeText={email => setUserInvited(userInvited ? { ...userInvited, email } : { name: '', email, role_id: selectedRole.id, message: '' })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                            />
                    </View>

                    {/* Campo de mensaje */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputIcon}>
                            <IconInfo width={20} height={20} fill={colors.primary} />
                        </View>
                        <Input
                            placeholder="Mensaje personalizado."
                            value={userInvited?.message || ''}
                            onChangeText={message => setUserInvited(userInvited ? { ...userInvited, message } : { name: '', email: '', role_id: selectedRole.id, message })}
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                            />
                    </View>

                    {/* Selección de Rol */}
                    <View style={styles.roleSection}>
                        <View style={styles.roleHeader}>
                            <View style={styles.roleIcon}>
                                <IconRoles width={20} height={20} fill={colors.primary} />
                            </View>
                            <CustomText style={styles.roleTitle}>Seleccionar Rol</CustomText>
                        </View>
                        
                        <TouchableOpacity onPress={() => setShowModal(true)}>
                            <Input placeholder="Seleccionar Rol" value={selectedRole.name} editable={false}/>
                        </TouchableOpacity>
                    </View>

                    {/* Botón de Envío */}
                    <Button
                        title={'Enviar Invitación'}
                        onPress={handleInvite}
                        style={styles.inviteButton}
                        loading={loading}
                        disabled={loading}
                    />
                </View>

                {/* Información Adicional */}
                <View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <CustomText style={styles.infoTitle}>¿Cómo funciona la invitación?</CustomText>
                        <CustomText style={styles.infoSubtitle}>Guía rápida para invitar nuevos miembros</CustomText>
                    </View>
                    
                    <View style={styles.infoStepsContainer}>
                        <View style={styles.infoStep}>
                            <View style={styles.stepNumberContainer}>
                                <CustomText style={styles.stepNumber}>1</CustomText>
                            </View>
                            <View style={styles.stepContent}>
                                <CustomText style={styles.stepTitle}>Envío de invitación</CustomText>
                                <CustomText style={styles.stepDescription}>
                                    El miembro recibirá un email con un enlace seguro de invitación para unirse a tu tienda
                                    que contiene un token único para activar su cuenta.
                                </CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.infoStep}>
                            <View style={styles.stepNumberContainer}>
                                <CustomText style={styles.stepNumber}>2</CustomText>
                            </View>
                            <View style={styles.stepContent}>
                                <CustomText style={styles.stepTitle}>Registro y acceso</CustomText>
                                <CustomText style={styles.stepDescription}>
                                    Deberá tener una cuenta de Wheek creada para poder acceder a su tienda.
                                </CustomText>
                            </View>
                        </View>
                        
                        <View style={styles.infoStep}>
                            <View style={styles.stepNumberContainer}>
                                <CustomText style={styles.stepNumber}>3</CustomText>
                            </View>
                            <View style={styles.stepContent}>
                                <CustomText style={styles.stepTitle}>Activación completa</CustomText>
                                <CustomText style={styles.stepDescription}>
                                    Una vez enviada la invitación, en la bandeja de notificaciones del miembro aparecera la invitación para aceptarla.
                                </CustomText>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.infoTipContainer}>
                        <View style={styles.tipIconContainer}>
                            <CustomText style={styles.tipIcon}>💡</CustomText>
                        </View>
                        <View style={styles.tipContent}>
                            <CustomText style={styles.tipTitle}>Consejo</CustomText>
                            <CustomText style={styles.tipText}>
                                Asegúrate de asignar el rol correcto según las responsabilidades que tendrá el miembro en tu tienda
                            </CustomText>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>

        <ModalOptions 
            visible={showModal} 
            onClose={() => setShowModal(false)}
        >
            <CustomText>Elige el rol del miembro.</CustomText>
            
            <ListRoles height={'90%'} onPress={(role) => {
                setSelectedRole({ name: role.name, id: role.id }); 
                setShowModal(false);
            }} />
        </ModalOptions>

        <CustomAlert {...alertState} onClose={hideAlert} />
    </>
    );
}

const styles = StyleSheet.create(   {
    formCard: {
        backgroundColor: colors.white,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.lightGray,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: colors.dark,
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 24,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginBottom: 20,
    },
    inputIcon: {
        marginRight: 12,
        marginLeft: 4,
    },
    input: {
        flex: 1,
    },
    roleSection: {
        marginBottom: 24,
    },
    roleHeader: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginBottom: 16,
    },
    roleIcon: {
        marginRight: 12,
        marginLeft: 4,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.dark,
    },
    rolesContainer: {
        gap: 12,
    },
    roleCard: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightGray,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
    },
    selectedRoleCard: {
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}05`,
    },
    roleCardContent: {
        flex: 1,
    },
    roleName: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.dark,
        marginBottom: 4,
    },
    selectedRoleName: {
        color: colors.primary,
    },
    roleDescription: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 18,
    },
    selectedIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    selectedDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
    },
    inviteButton: {
        marginTop: 8,
    },
    loadingContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginTop: 16,
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
        color: colors.gray,
    },
    infoCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.lightGray,
        marginBottom: 40,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
    },
    infoText: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 8,
        lineHeight: 18,
    },
    infoHeader: {
        marginBottom: 24,
        alignItems: 'center' as const,
    },
    infoSubtitle: {
        fontSize: 14,
        color: colors.gray,
        marginTop: 4,
        textAlign: 'center' as const,
    },
    infoStepsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    infoStep: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        gap: 12,
    },
    stepNumberContainer: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.primary,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginTop: 2,
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: colors.white,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: colors.dark,
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 18,
    },
    infoTipContainer: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: `rgba(221, 214, 211, 0.9)`,
    },
    tipIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${colors.primary}15`,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    tipIcon: {
        fontSize: 16,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: colors.primary,
        marginBottom: 2,
    },
    tipText: {
        fontSize: 13,
        color: colors.gray,
        lineHeight: 16,
    },
});
