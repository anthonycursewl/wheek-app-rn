// React Native components
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';

import CustomText from "@components/CustomText/CustomText";
import { NotificationService, Notification } from '@flux/services/Notifications/NotificationService';
import { useGlobalStore } from '@flux/stores/useGlobalStore';
import useAuthStore from '@flux/stores/AuthStore';

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore()
    const { currentStore } = useGlobalStore()

    
    const loadNotifications = async (isInitialLoad: boolean = false) => {
        setLoading(true);
        const { data, error } = await NotificationService.getNotifications(user?.email || '', 10, notifications.length);
        
        if (error) {
            console.error('Error al cargar notificaciones:', error);
            setLoading(false);
            return;
        }
        
        setNotifications([...(data || [])]);
        console.log("data")
        setLoading(false);
    };
    
    useEffect(() => {
        loadNotifications(true);
    }, [user]);

    const loadMoreNotifications = async () => {
        setLoading(true);
        const { data, error } = await NotificationService.getNotifications(user?.email || '', 10, notifications.length);
        
        if (error) {
            console.error('Error al cargar más notificaciones:', error);
            setLoading(false);
            return;
        }
        
        setNotifications((prevNotifications) => [...(prevNotifications || []), ...(data || [])]);
        setLoading(false);
    };

    const acceptNotification = async (notificationId: string) => {
        const { data, error } = await NotificationService.acceptNotification(notificationId);
        
        if (error) {
            console.error('Error al aceptar notificación:', error);
            Alert.alert('Wheek | Error', 'No se pudo aceptar la invitación. Inténtalo de nuevo.');
            return;
        }
        
        if (data) {
            Alert.alert('Wheek | Invitación aceptada', 'La invitación ha sido aceptada.');
            setNotifications(prev =>
                prev.filter(notif => notif.id !== notificationId)
            );
        }
    };

    const handleAcceptInvitation = (notificationId: string) => {
        Alert.alert(
            'Wheek | Aceptar Invitación',
            '¿Estás seguro que quieres aceptar esta invitación?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Aceptar',
                    onPress: () => {
                        acceptNotification(notificationId);
                    },
                },
            ]
        );
    };

    const handleRejectInvitation = async (notificationId: string) => {
        Alert.alert(
            'Rechazar Invitación',
            '¿Estás seguro que quieres rechazar esta invitación?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Rechazar',
                    onPress: async () => {
                        const { data, error } = await NotificationService.rejectNotification(notificationId)
                        
                        if (error) {
                            console.error('Error al rechazar notificación:', error);
                            Alert.alert('Wheek | Error', 'No se pudo rechazar la invitación. Inténtalo de nuevo.');
                            return;
                        }
                        
                        if (data) {
                            setNotifications(prev =>
                                prev.filter(notif => notif.id !== notificationId)
                            );
                            Alert.alert('Wheek | Invitación rechazada', 'La invitación ha sido eliminada.');
                        }
                    },
                },
            ]
        );
    }   

    const markAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, status: 'READ' }
                    : notif
            )
        );
    };

    const renderNotification = (notification: Notification) => {
        return (
            <TouchableOpacity
                key={notification.id}
                style={[
                    styles.notificationCard,
                    notification.status === 'PENDING' && styles.unreadNotification
                ]}
                onPress={() => markAsRead(notification.id)}
            >
                <LinearGradient
                    colors={notification.status === 'PENDING' ? ['rgba(165, 132, 255, 0.1)', 'rgba(133, 87, 206, 0.1)'] : ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.02)']}
                    style={styles.notificationGradient}
                >
                    {/* Header Section */}
                    <View style={styles.notificationHeader}>
                        <View style={[styles.iconContainer, styles.invitationIcon]}>
                            <MaterialCommunityIcons
                                name="account-plus"
                                size={20}
                                color="rgb(165, 132, 255)"
                            />
                        </View>
                        <View style={styles.notificationTitleContainer}>
                            <CustomText style={styles.notificationTitle}>
                                Invitación a unirte
                            </CustomText>
                            <CustomText style={styles.timestamp}>
                                {new Date(notification.created_at).toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </CustomText>
                        </View>
                        {notification.status === 'PENDING' && (
                            <View style={styles.unreadDot} />
                        )}
                    </View>

                    {/* Message Section */}
                    <View style={styles.messageSection}>
                        <CustomText style={styles.notificationMessage}>
                            {`${notification.invited_by.name} ${notification.invited_by.last_name} te ha invitado como ${notification.role.name} a la tienda ${notification.store.name}`}
                        </CustomText>
                    </View>

                    {/* Details Section */}
                    <View style={styles.detailsSection}>
                        <View style={styles.detailRow}>
                            <CustomText style={styles.detailLabel}>Tienda:</CustomText>
                            <CustomText style={styles.detailValue}>{notification.store.name}</CustomText>
                        </View>
                        <View style={styles.detailRow}>
                            <CustomText style={styles.detailLabel}>Rol:</CustomText>
                            <CustomText style={styles.detailValue}>{notification.role.name}</CustomText>
                        </View>
                        <View style={styles.detailRow}>
                            <CustomText style={styles.detailLabel}>Enviado por:</CustomText>
                            <CustomText style={styles.detailValue}>{notification.invited_by.name} {notification.invited_by.last_name}</CustomText>
                        </View>
                        <View style={styles.detailRow}>
                            <CustomText style={styles.detailLabel}>Expira:</CustomText>
                            <CustomText style={styles.expirationValue}>
                                {new Date(notification.expires_at).toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </CustomText>
                        </View>
                    </View>

                    {/* Actions Section */}
                    <View style={styles.invitationActions}>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleRejectInvitation(notification.id)}
                        >
                            <LinearGradient
                                colors={['rgba(239, 68, 68, 0.05)', 'rgba(220, 38, 38, 0.02)']}
                                style={styles.buttonGradient}
                            >
                                <CustomText style={styles.rejectButtonText}>Rechazar</CustomText>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAcceptInvitation(notification.id)}
                        >
                            <LinearGradient
                                colors={['rgb(165, 132, 255)', 'rgb(133, 87, 206)']}
                                style={styles.buttonGradient}
                            >
                                <CustomText style={styles.acceptButtonText}>Aceptar</CustomText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(165, 132, 255)" />
                <CustomText style={styles.loadingText}>Cargando notificaciones...</CustomText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <CustomText style={styles.headerTitle}>Notificaciones</CustomText>
                <CustomText style={styles.headerSubtitle}>
                    {(notifications || []).filter(n => n.status === 'PENDING').length} sin leer
                </CustomText>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {[
                    ...(notifications.length === 0 ? [
                        <View key="empty" style={styles.emptyContainer}>
                            <MaterialCommunityIcons
                                name="bell-off-outline"
                                size={32}
                                color="rgba(165, 132, 255, 0.4)"
                            />
                            <CustomText style={styles.emptyText}>No tienes notificaciones</CustomText>
                        </View>
                    ] : []),
                    ...notifications.map(notification => renderNotification(notification))
                ]}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        padding: 16,
        paddingTop: 48,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(165, 132, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6b7280',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 8,
    },
    notificationCard: {
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.5)',
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    unreadNotification: {
        backgroundColor: 'rgba(165, 132, 255, 0.03)',
        borderColor: 'rgba(165, 132, 255, 0.3)',
    },
    notificationGradient: {
        padding: 14,
        backgroundColor: '#ffffff',
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    invitationIcon: {
        borderColor: 'rgb(165, 132, 255)',
        backgroundColor: 'rgba(165, 132, 255, 0.1)',
    },
    infoIcon: {
        borderColor: 'rgb(133, 87, 206)',
        backgroundColor: 'rgba(133, 87, 206, 0.1)',
    },
    acceptButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ffffff',
    },
    rejectButtonText: {
        fontSize: 13,
        color: 'rgb(239, 68, 68)',
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 1,
    },
    timestamp: {
        fontSize: 11,
        color: '#9ca3af',
    },
    notificationMessage: {
        fontSize: 13,
        color: '#4b5563',
        lineHeight: 18,
        marginBottom: 10,
    },
    invitationDetails: {
        backgroundColor: 'rgba(165, 132, 255, 0.02)',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(165, 132, 255, 0.1)',
        borderStyle: 'dashed',
    },
    storeName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 4,
    },
    roleName: {
        fontSize: 13,
        fontWeight: '500',
        color: 'rgb(165, 132, 255)',
        marginBottom: 4,
    },
    senderName: {
        fontSize: 11,
        color: '#6b7280',
    },
    expirationDate: {
        fontSize: 11,
        color: '#ef4444',
        fontWeight: '500',
    },
    messageSection: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    detailsSection: {
        backgroundColor: 'rgba(165, 132, 255, 0.03)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(165, 132, 255, 0.1)',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        flex: 1,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '500',
        color: '#1f2937',
        flex: 2,
        textAlign: 'right',
    },
    expirationValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ef4444',
        flex: 2,
        textAlign: 'right',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 6,
    },
    acceptButton: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectButton: {
        flex: 1,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.4)',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    notificationTitleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgb(165, 132, 255)',
    },
    invitationActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    buttonGradient: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
});

export default NotificationsScreen;
