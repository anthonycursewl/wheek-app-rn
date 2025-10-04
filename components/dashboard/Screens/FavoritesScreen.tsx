// React Native components
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';

// Components
import LayoutScreen from "@components/Layout/LayoutScreen";
import CustomText from "@components/CustomText/CustomText";

interface Notification {
    id: string;
    type: 'invitation' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    storeName?: string;
    senderName?: string;
}

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Simular carga de notificaciones
    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        // Simular llamada a API
        setTimeout(() => {
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    type: 'invitation',
                    title: 'Invitaci�n a colaborar',
                    message: 'Te han invitado a colaborar en la tienda "Mi Tienda Premium"',
                    timestamp: 'Hace 2 horas',
                    read: false,
                    storeName: 'Mi Tienda Premium',
                    senderName: 'Juan P�rez'
                },
                {
                    id: '2',
                    type: 'info',
                    title: 'Actualizaci�n del sistema',
                    message: 'Hemos actualizado las funciones de gesti�n de inventario con nuevas mejoras',
                    timestamp: 'Hace 5 horas',
                    read: true
                },
                {
                    id: '3',
                    type: 'invitation',
                    title: 'Nueva invitaci�n',
                    message: 'Mar�a Garc�a te invita a unirte a "Tienda Express" como administrador',
                    timestamp: 'Ayer',
                    read: false,
                    storeName: 'Tienda Express',
                    senderName: 'Mar�a Garc�a'
                },
                {
                    id: '4',
                    type: 'info',
                    title: 'Recordatorio de respaldo',
                    message: 'No olvides hacer un respaldo de tus datos esta semana',
                    timestamp: 'Hace 2 d�as',
                    read: true
                }
            ];
            setNotifications(mockNotifications);
            setLoading(false);
        }, 1500);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    const handleAcceptInvitation = (notificationId: string) => {
        Alert.alert(
            'Aceptar Invitaci�n',
            '�Est�s seguro que quieres aceptar esta invitaci�n?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Aceptar',
                    onPress: () => {
                        // Actualizar estado de la notificaci�n
                        setNotifications(prev => 
                            prev.map(notif => 
                                notif.id === notificationId 
                                    ? { ...notif, read: true } 
                                    : notif
                            )
                        );
                        Alert.alert('�Invitaci�n aceptada!', 'Ahora puedes colaborar en esta tienda.');
                    },
                },
            ]
        );
    };

    const handleRejectInvitation = (notificationId: string) => {
        Alert.alert(
            'Rechazar Invitaci�n',
            '�Est�s seguro que quieres rechazar esta invitaci�n?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Rechazar',
                    onPress: () => {
                        // Eliminar la notificaci�n
                        setNotifications(prev => 
                            prev.filter(notif => notif.id !== notificationId)
                        );
                        Alert.alert('Invitaci�n rechazada', 'La invitaci�n ha sido eliminada.');
                    },
                },
            ]
        );
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, read: true } 
                    : notif
            )
        );
    };

    const renderSkeleton = () => (
        <View style={styles.skeletonContainer}>
            {[1, 2, 3].map((index) => (
                <View key={index} style={styles.skeletonItem}>
                    <View style={styles.skeletonIcon} />
                    <View style={styles.skeletonText}>
                        <View style={styles.skeletonLine} />
                        <View style={[styles.skeletonLine, { width: '70%' }]} />
                    </View>
                </View>
            ))}
        </View>
    );

    const renderNotification = (notification: Notification) => {
        const isInvitation = notification.type === 'invitation';
        
        return (
            <TouchableOpacity 
                key={notification.id}
                style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification
                ]}
                onPress={() => markAsRead(notification.id)}
                activeOpacity={0.7}
            >
                <View style={styles.notificationContent}>
                    <LinearGradient
                        colors={isInvitation 
                            ? ['rgb(165, 132, 255)', 'rgb(133, 87, 206)'] 
                            : ['rgb(74, 222, 128)', 'rgb(34, 197, 94)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.notificationIcon}
                    >
                        <MaterialCommunityIcons 
                            name={isInvitation ? 'account-plus' : 'information'} 
                            size={20} 
                            color="#fff" 
                        />
                    </LinearGradient>
                    
                    <View style={styles.notificationText}>
                        <CustomText style={styles.notificationTitle}>
                            {notification.title}
                        </CustomText>
                        <CustomText style={styles.notificationMessage}>
                            {notification.message}
                        </CustomText>
                        <CustomText style={styles.notificationTimestamp}>
                            {notification.timestamp}
                        </CustomText>
                    </View>
                    
                    {!notification.read && (
                        <View style={styles.unreadDot} />
                    )}
                </View>
                
                {isInvitation && (
                    <View style={styles.invitationActions}>
                        <TouchableOpacity 
                            style={styles.rejectButton}
                            onPress={() => handleRejectInvitation(notification.id)}
                        >
                            <CustomText style={styles.rejectButtonText}>Rechazar</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.acceptButton}
                            onPress={() => handleAcceptInvitation(notification.id)}
                        >
                            <CustomText style={styles.acceptButtonText}>Aceptar</CustomText>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <LayoutScreen>
            <View style={styles.container}>
                {/* Header */}
                <LinearGradient
                    colors={['rgb(165, 132, 255)', 'rgb(133, 87, 206)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <CustomText style={styles.headerTitle}>Notificaciones</CustomText>
                    <CustomText style={styles.headerSubtitle}>
                        {notifications.filter(n => !n.read).length} no le�das
                    </CustomText>
                </LinearGradient>

                {/* Lista de notificaciones */}
                {loading ? (
                    renderSkeleton()
                ) : (
                    <ScrollView 
                        style={styles.notificationsList}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                tintColor='rgb(165, 132, 255)'
                            />
                        }
                    >
                        {notifications.length > 0 ? (
                            notifications.map(renderNotification)
                        ) : (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons 
                                    name="bell-off" 
                                    size={48} 
                                    color="
gb(200, 200, 200)" 
                                />
                                <CustomText style={styles.emptyStateTitle}>
                                    No tienes notificaciones
                                </CustomText>
                                <CustomText style={styles.emptyStateMessage}>
                                    Las notificaciones aparecer�n aqu� cuando las recibas
                                </CustomText>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </LayoutScreen>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(248, 248, 248, 0.5)',
    },
    
    // Header
    header: {
        width: '100%',
        paddingTop: 40,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
    },
    
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Skeletons
    skeletonContainer: {
        paddingHorizontal: 16,
    },
    
    skeletonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgb(45, 22, 107)',
    },
    
    skeletonIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgb(200, 200, 200)',
        marginRight: 16,
    },
    
    skeletonText: {
        flex: 1,
    },
    
    skeletonLine: {
        height: 12,
        backgroundColor: 'rgb(200, 200, 200)',
        borderRadius: 6,
        marginBottom: 8,
    },
    
    // Lista de notificaciones
    notificationsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    
    notificationItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgb(165, 132, 255)',
        overflow: 'hidden',
    },
    
    unreadNotification: {
        backgroundColor: 'rgba(165, 132, 255, 0.05)',
    },
    
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
    },
    
    notificationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    
    notificationText: {
        flex: 1,
    },
    
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'rgb(49, 49, 49)',
        marginBottom: 4,
    },
    
    notificationMessage: {
        fontSize: 14,
        color: 'rgb(120, 120, 120)',
        marginBottom: 8,
        lineHeight: 20,
    },
    
    notificationTimestamp: {
        fontSize: 12,
        color: 'rgb(150, 150, 150)',
    },
    
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgb(165, 132, 255)',
        marginLeft: 8,
    },
    
    // Acciones de invitaci�n
    invitationActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(165, 132, 255, 0.1)',
    },
    
    rejectButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: 'rgba(165, 132, 255, 0.1)',
    },
    
    rejectButtonText: {
        fontSize: 14,
        color: 'rgb(229, 62, 62)',
        fontWeight: '500',
    },
    
    acceptButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    
    acceptButtonText: {
        fontSize: 14,
        color: 'rgb(165, 132, 255)',
        fontWeight: '600',
    },
    
    // Estado vac�o
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgb(100, 100, 100)',
        marginTop: 16,
        marginBottom: 8,
    },
    
    emptyStateMessage: {
        fontSize: 14,
        color: 'rgb(150, 150, 150)',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});

export default NotificationsScreen;
