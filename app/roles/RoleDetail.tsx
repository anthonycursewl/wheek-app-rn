import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    View, 
    Animated,
    ActivityIndicator 
} from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { RoleWithPermissions } from "@flux/entities/Role";
import { useRoleStore } from "@flux/stores/useRoleStore";
import { roleAttemptAction, roleFailureAction, roleSuccessDeleteAction, roleSuccessGetAction } from "@flux/Actions/RoleActions";
import { RoleService } from "@flux/services/Roles/RoleService";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import LogoPage from "@components/LogoPage/LogoPage";
import Constants from 'expo-constants';
import { ButtonWithoutTitle } from "@components/Buttons/ButtonWithoutTitle";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

// Components
import { DetailRow } from "shared/components/DetailRow";
import CustomAlert from "shared/components/CustomAlert";
import { useAlert } from "shared/hooks/useAlert";

const actionStyles: { [key: string]: { color: string; backgroundColor: string; label: string } } = {
  create: { label: 'Crear', color: '#006400', backgroundColor: '#e6f4e6' },
  read: { label: 'Leer', color: '#0000CD', backgroundColor: '#e6e6fa' },
  update: { label: 'Actualizar', color: '#FF8C00', backgroundColor: '#fff4e6' },
  delete: { label: 'Eliminar', color: '#DC143C', backgroundColor: '#fae6e6' },
  manage: { label: 'Gestionar', color: '#4B0082', backgroundColor: '#f0e6fa' },
};

const PermissionTag = ({ action }: { action: string }) => {
  const styleInfo = actionStyles[action] || { label: action, color: '#333', backgroundColor: '#eee' };
  return (
    <View style={[styles.tag, { backgroundColor: styleInfo.backgroundColor }]}>
      <CustomText style={{ color: styleInfo.color, fontWeight: '500' }}>{styleInfo.label}</CustomText>
    </View>
  );
};

const PermissionsCard = ({ resource, actions }: { resource: string, actions: string[] }) => {
  const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);
  return (
    <View style={styles.card}>
      <CustomText style={styles.cardTitle}>{resourceName}</CustomText>
      <View style={styles.tagsContainer}>
        {actions.map((action, index) => (
          <PermissionTag key={index} action={action} />
        ))}
      </View>
    </View>
  );
};

export default function RoleDetail() {
    const { dispatch, loading: loadingRoles } = useRoleStore();
    const { currentStore, alertState, showSuccess, showResponse, hideAlert } = useGlobalStore();
    const { role } = useLocalSearchParams();
    const roleData: RoleWithPermissions = JSON.parse(decodeURIComponent(role as string));
    const [roleDetail, setRoleDetail] = useState<RoleWithPermissions>(roleData);
    const { setSelectedRole } = useRoleStore()

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleLoadRoleDetail = async () => {
        if (!roleData.id) return;

        dispatch(roleAttemptAction());
        const { data, error } = await RoleService.getRoleById(roleData.id, currentStore.id);
        if (error) {
            return dispatch(roleFailureAction(error));
        } 
        if (data) {
            setRoleDetail(data);
            dispatch(roleSuccessGetAction(data));
        }
    };

    useEffect(() => {
        handleLoadRoleDetail();
    }, []);

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: ['transparent', 'rgba(255, 255, 255, 0.95)'],
        extrapolate: 'clamp',
    });
    
    const headerBorderOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const parseDate = (date: Date) => new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const groupPermissionsByResource = (permissions: { permission: { action: string, resource: string }}[]) => {
        if (!permissions) return {};
        return permissions.reduce((acc, current) => {
            if (!acc[current.permission.resource]) acc[current.permission.resource] = [];
            acc[current.permission.resource].push(current.permission.action);
            return acc;
        }, {} as Record<string, string[]>);
    };

    const handleTapOnDelete = () => {
        showSuccess('¿Estás seguro que deseas mandar a la basura este rol?', {
            requiresConfirmation: true,
            onConfirm: async () => {
                dispatch(roleAttemptAction());
                hideAlert()
                showSuccess('Eliminando rol...', { isLoading: loadingRoles })

                const { data, error } = await RoleService.delete(roleDetail.id, currentStore.id)  
                if (error) return dispatch(roleFailureAction(error));
                if (data) {
                    dispatch(roleSuccessDeleteAction(data));
                    showResponse(`¡Rol ${data.name} eliminado exitosamente!`, { 
                        icon: 'success', 
                        onClose() { router.back() },
                        duration: 1500
                    });
                }
            },
        })
    }
    
    const handleTapOnUpdate = () => {   
        router.push(`/roles/create?mode=update`)
        setSelectedRole(roleDetail)
    }
    
    const groupedPermissions = groupPermissionsByResource(roleDetail.permissions || []);
    
    if (loadingRoles && !roleDetail.id) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    return (
        <>
        <View style={styles.main}>
            <Animated.View style={[
                styles.statusBar,
                { 
                    backgroundColor: headerBackgroundColor,
                    borderBottomColor: 'rgba(224, 224, 224, 1)',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    opacity: headerBorderOpacity
                }
            ]} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={{ height: Constants.statusBarHeight }} />

                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <View>
                            <LogoPage height={20} width={80}/>
                        </View>
                        <CustomText style={styles.headerTitle}>Roles</CustomText>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
                        <ButtonWithoutTitle icon={<MaterialIcons name="edit" size={22} color="black" />} onPress={handleTapOnUpdate} />
                        <ButtonWithoutTitle icon={<MaterialIcons name="delete" size={22} color="black" />} onPress={handleTapOnDelete} />
                    </View>

                    <View style={styles.detailsSection}>
                        <DetailRow label="Nombre" value={roleDetail.name} />
                        <DetailRow label="Descripción" value={roleDetail.description || 'N/A'} />
                        <DetailRow label="ID de la tienda" value={roleDetail.store_id ? roleDetail.store_id : 'N/A'} />
                        <DetailRow label="Fecha de Creación" value={parseDate(roleDetail.created_at)} />
                        <DetailRow label="Fecha de Actualización" value={parseDate(roleDetail.updated_at || new Date())} />
                        <DetailRow label="Estado" value={roleDetail.is_active ? 'Activo 🌱' : 'Inactivo 🥀'} />
                    </View>

                    <View style={styles.permissionsSection}>
                        <CustomText style={styles.sectionTitle}>Permisos Asignados</CustomText>
                        {Object.keys(groupedPermissions).length > 0 ? (
                            Object.keys(groupedPermissions).map((resource) => (
                                <PermissionsCard key={resource} resource={resource} actions={groupedPermissions[resource]} />
                            ))
                        ) : (
                            <CustomText style={styles.noPermissionsText}>
                                Este rol no tiene permisos asignados.
                            </CustomText>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
        <CustomAlert {...alertState} onClose={hideAlert}/>
        </>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
    },
    statusBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Constants.statusBarHeight,
        zIndex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 14,
    },
    detailsSection: {
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    permissionsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333'
    },
    noPermissionsText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 10,
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 12,
    }
});