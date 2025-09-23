// React Native components
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Components
import LayoutScreen from "@components/Layout/LayoutScreen";
import CustomText from "@components/CustomText/CustomText";

// Stores
import useAuthStore from "@flux/stores/AuthStore";
import { useProviderStore } from "@flux/stores/useProviderStore";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { useCategoryStore } from "@flux/stores/useCategoryStore";
import { useShopStore } from "@flux/stores/useShopStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileOption {
    title: string;
    icon: string | undefined;
    route: string;
    color: string;
}

export const ProfileScreen = () => {
    const { user, clearStore: lguser } = useAuthStore();
    const { clearStore: lgprov } = useProviderStore();
    const { clearStore: lggl } = useGlobalStore();
    const { clearStore: lgcat } = useCategoryStore();
    const { clearStore: lgshop } = useShopStore();

    const handleLogout = async () => {

        Alert.alert('Wheek | Cerrar sesión', 
            '¿Estás seguro que quieres cerrar la sesión?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    onPress: async () => {
                        lgprov();
                        lguser();
                        lggl();
                        lgcat();
                        lgshop();
                        await AsyncStorage.removeItem('token');
                        router.replace('/');
                    },
                },
            ]
        )
    };

    const profileOptions: ProfileOption[] = [
        {
            title: 'Gestionar Mis Tiendas',
            icon: 'store',
            route: '/',
            color: '#3182CE'
        },
        {
            title: 'Gestionar Categorías',
            icon: 'tag-multiple',
            route: '/',
            color: '#38A169'
        },
        {
            title: 'Gestionar Proveedores',
            icon: 'truck-delivery',
            route: '/',
            color: '#DD6B20'
        },
        {
            title: 'Editar Perfil',
            icon: 'account-edit',
            route: '/',
            color: '#805AD5'
        },
        {
            title: 'Configuración',
            icon: 'cog',
            route: '/', 
            color: '#718096'
        },
    ];

    return (
        <LayoutScreen>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <MaterialCommunityIcons name="account" size={60} color="#4A5568" />
                    </View>
                    <CustomText style={styles.userName}>{user?.name || 'Nombre de Usuario'}</CustomText>
                    <CustomText style={styles.userEmail}>{user?.email || 'email@ejemplo.com'}</CustomText>
                </View>

                <View style={styles.optionsContainer}>
                    {profileOptions.map((option, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.optionItem} 
                            onPress={() => router.push(option.route as any)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                                <MaterialCommunityIcons name={option.icon as any} size={22} color="#fff" />
                            </View>
                            <CustomText style={styles.optionText}>{option.title}</CustomText>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#A0AEC0" />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={22} color="#E53E3E" />
                    <CustomText style={styles.logoutButtonText}>Cerrar Sesión</CustomText>
                </TouchableOpacity>

            </ScrollView>
        </LayoutScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A202C',
    },
    userEmail: {
        fontSize: 16,
        color: '#718096',
    },
    optionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: '#FED7D7',
        paddingVertical: 14,
        borderRadius: 12,
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#E53E3E',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});