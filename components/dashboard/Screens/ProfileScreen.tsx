// React Native components
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
import { useMemberStore } from '@flux/stores/useMemberStore';
import { useRoleStore } from '@flux/stores/useRoleStore';
import { useInventoryStore } from '@flux/stores/useInventoryStore';
import { useAdjustmentStore } from '@flux/stores/useAdjustmentStore';
import { useProductStore } from '@flux/stores/useProductStore';
import { useReceptionStore } from '@flux/stores/useReceptionStore';

type TabType = 'products' | 'categories' | 'providers' | 'receptions' | 'adjustments' | 'inventory' | 'roles' | 'profile' | 'settings';

interface ProfileOption {
    title: string;
    icon: string | undefined;
    color: string;
    description: string;
    route: string;
    tab: TabType;
}

export const ProfileScreen = () => {
    const { user, clearStore: lguser } = useAuthStore();
    const { clearStore: lgprov } = useProviderStore();
    const { clearStore: lggl, currentStore } = useGlobalStore();
    const { clearStore: lgcat } = useCategoryStore();
    const { clearStore: lgshop } = useShopStore();
    const { setCurrentStore } = useGlobalStore()
    const { clearStore: lgmember } = useMemberStore()
    const { clearStore: lgrole } = useRoleStore()
    const { clearStore: lginventory } = useInventoryStore()
    const { clearStore: lgadjustment } = useAdjustmentStore()
    const { clearStore: lgproduct } = useProductStore()
    const { clearStore: lgreception } = useReceptionStore()

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
                        lgmember();
                        lgrole();
                        lginventory();
                        lgadjustment();
                        lgproduct();
                        lgreception();
                            setCurrentStore({
                            id: '',
                            name: '',
                            description: '',
                            is_active: false,
                            created_at: new Date(),
                            owner: '',
                        });
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
            color: 'rgb(165, 132, 255)',
            description: 'Administra tus tiendas y sucursales',
            route: '/store/manage/[id]',
            tab: 'products'
        },
        {
            title: 'Gestionar Categorías',
            icon: 'tag-multiple',
            color: 'rgb(133, 87, 206)',
            description: 'Organiza tus productos por categorías',
            route: '/store/manage/[id]',
            tab: 'categories'
        },
        {
            title: 'Gestionar Proveedores',
            icon: 'truck-delivery',
            color: 'rgb(219, 180, 255)',
            description: 'Controla tus proveedores y pedidos',
            route: '/store/manage/[id]',
            tab: 'providers'
        },
        {
            title: 'Editar Perfil',
            icon: 'account-edit',
            color: 'rgb(165, 132, 255)',
            description: 'Actualiza tu información personal',
            route: '/profile/edit',
            tab: 'profile'
        },
        {
            title: 'Configuración',
            icon: 'cog',
            color: 'rgb(133, 87, 206)',
            description: 'Personaliza la configuración de la app',
            route: '/settings',
            tab: 'settings'
        },
    ];
    return (
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header con gradiente */}
                <LinearGradient
                    colors={['rgb(165, 132, 255)', 'rgb(133, 87, 206)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientHeader}
                >
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                                style={styles.avatarGradient}
                            >
                                <View style={styles.avatar}>
                                    <MaterialCommunityIcons name="account" size={50} color="rgba(255, 255, 255, 0.9)" />
                                </View>
                            </LinearGradient>
                        </View>
                        <CustomText style={styles.userName}>{user?.name || 'Nombre de Usuario'}</CustomText>
                        <CustomText style={styles.userEmail}>{user?.email || 'email@ejemplo.com'}</CustomText>
                    </View>
                </LinearGradient>

                {/* Contenedor de opciones con estilo minimalista */}
                <View style={styles.optionsContainer}>
                    {profileOptions.map((option, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.optionItem} 
                            onPress={() => {
                                if (option.route === '/store/manage/[id]') {
                                    if (!currentStore || !currentStore.id) {
                                        Alert.alert('Seleccionar Tienda', 'Por favor, selecciona una tienda para gestionar.');
                                    } else {
                                        router.push({
                                            pathname: option.route as any,
                                            params: { id: currentStore.id, tab: option.tab },
                                        });
                                    }
                                } else {
                                    router.push(option.route as any);
                                }
                            }}
                        >
                            <LinearGradient
                                colors={[option.color, `${option.color}80`]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.iconContainer}
                            >
                                <MaterialCommunityIcons name={option.icon as any} size={16} color="#fff" />
                            </LinearGradient>
                            <View style={styles.textContainer}>
                                <CustomText style={styles.optionText}>{option.title}</CustomText>
                                <CustomText style={styles.optionDescription}>{option.description}</CustomText>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={20} color="rgb(165, 132, 255)" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Botón de logout con estilo mejorado */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LinearGradient
                        colors={['rgba(229, 62, 62, 0.1)', 'rgba(229, 62, 62, 0.05)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoutGradient}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="#E53E3E" />
                        <CustomText style={styles.logoutButtonText}>Cerrar Sesión</CustomText>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 24,
        backgroundColor: 'rgba(248, 248, 248, 0.5)',
    },
    
    // Header con gradiente
    gradientHeader: {
        width: '100%',
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    
    profileHeader: {
        alignItems: 'center',
    },
    
    avatarContainer: {
        marginBottom: 16,
    },
    
    avatarGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    
    userEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Contenedor de opciones
    optionsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        marginHorizontal: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgb(165, 132, 255)',
        overflow: 'hidden',
    },
    
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(165, 132, 255, 0.1)',
    },
    
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    
    optionText: {
        fontSize: 15,
        color: 'rgb(49, 49, 49)',
        fontWeight: '500',
        marginBottom: 2,
    },
    
    optionDescription: {
        fontSize: 12,
        color: 'rgb(120, 120, 120)',
        fontWeight: '400',
    },
    
    // Botón de logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginHorizontal: 16,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(229, 62, 62, 0.3)',
        overflow: 'hidden',
    },
    
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        width: '100%',
    },
    
    logoutButtonText: {
        fontSize: 15,
        color: '#E53E3E',
        fontWeight: '600',
        marginLeft: 8,
    },
});
