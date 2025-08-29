// Custom components
import LayoutScreen from "@components/Layout/LayoutScreen"
import CustomText from "@components/CustomText/CustomText"
import LogoPage from "@components/LogoPage/LogoPage"
import Input from "@components/Input/Input"
import Button from "@components/Buttons/Button"
import { PermissionSection, Permission, Permissions } from "@components/dashboard/roles/components/PermissionSection"

// global store
import { useGlobalStore } from "@flux/stores/useGlobalStore"

// Core stuff
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import StoreLogo from "svgs/StoreLogo"
import { useState, useEffect } from "react"
import { usePermissionStore } from "@flux/stores/usePermissionStore"


// Entities
import { Role } from "@flux/entities/Role"
import { RoleService } from "@flux/services/Roles/RoleService"
import { useRoleStore } from "@flux/stores/useRoleStore"
import { roleAttemptAction, roleFailureAction, roleSuccessCreateAction } from "@flux/Actions/RoleActions"
import CustomAlert from "shared/components/CustomAlert"
import { router } from "expo-router"

const Block = ({ label, placeholder, handleChangeRole, field }: { label: string, placeholder: string, handleChangeRole: (text: string, field: keyof Role) => void, field: keyof Role }) => {
  return (
    <View style={{ gap: 10 }}>
      <CustomText>{label}</CustomText>
      <Input placeholder={placeholder} onChangeText={(text) => handleChangeRole(text, field)}/>
    </View>
  )
}

export default function CreateRole() {
  const actions = { create: false, read: false, update: false, delete: false, manage: false }
  const { currentStore } = useGlobalStore()
  const { groupedPermissions, fetchPermissions, loading, error } = usePermissionStore()
  const { dispatch, loading: loadingRoles, error: errorRoles } = useRoleStore()

  const [selectedPermissions, setSelectedPermissions] = useState<Permissions>({
    products: actions,
    categories: actions,
    providers: actions,
    roles: actions,
    stores: actions,
    manage: actions,
  });

  const [role, setRole] = useState<Omit<Role, 'created_at' | 'updated_at' | 'deleted_at' | 'is_active' | 'id'>>({
      name: '',
      description: '',
      store_id: currentStore.id,
      permissions: [],
    })
  const [alert, setAlert] = useState({ visible: false, message: '' })
  
  useEffect(() => {
    fetchPermissions(currentStore.id)
  }, [fetchPermissions]); 

  
  useEffect(() => {
    if (Object.keys(groupedPermissions).length > 0) {
      const initialState: Permissions = { products: actions, categories: actions, providers: actions, roles: actions, stores: actions, manage: actions };
      for (const resource in groupedPermissions) {
        initialState[resource] = actions;
      }
      if (initialState.stores) {
        initialState.stores.read = false;
        initialState.stores.update = false;
      }
      setSelectedPermissions(initialState);
    }
  }, [groupedPermissions]);

  useEffect(() => {
    if (errorRoles) {
      const timer = setTimeout(() => {
        dispatch(roleFailureAction(''));
        setAlert({ visible: false, message: '' })
      }, 3000);
      
      return () => {
        dispatch(roleFailureAction(''));
        setAlert({ visible: false, message: '' })
        clearTimeout(timer)
      };
    }

  }, [errorRoles, dispatch]);

  const handlePermissionsChange = (
    module: string,
    newPermissions: Permission
  ) => {
    setSelectedPermissions(prevPermissions => ({
      ...prevPermissions,
      [module]: newPermissions
    }));
  };

  const parsePermissionsForAPI = (permissions: Permissions): string[] => {
    const permissionsArray: string[] = [];
    for (const resource of Object.keys(permissions)) {
      for (const action of Object.keys(permissions[resource])) {
        if (permissions[resource][action as keyof Permission]) {
          permissionsArray.push(`${resource}:${action}`);
        }
      }
    }
    return permissionsArray;
  };
  
  const handleChangeRole = (text: string, field: keyof Role) => {
    setRole({
      ...role,
      [field]: text,
    })
  }

  const handleCreateRole = async () => {
    const permissions = parsePermissionsForAPI(selectedPermissions);
    const newRole = { ...role, permissions: permissions }

    if (!role.name || !role.description) return setAlert({ visible: true, message: 'Todos los campos son obligatorios! Intenta de nuevo.' })
    if (!permissions.length) return setAlert({ visible: true, message: 'Debes seleccionar al menos un permiso! Intenta de nuevo.' })

    dispatch(roleAttemptAction())
    const { data, error } = await RoleService.createRole(newRole)

    if (error) {
      setAlert({ visible: true, message: error })
      return dispatch(roleFailureAction(error))
    }
    if (data) {
      dispatch(roleSuccessCreateAction(data))
      setAlert({ visible: true, message: 'Rol creado exitosamente!' })
      setTimeout(() => {
        if (router.canGoBack()) return router.back();
      }, 3000);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return <CustomText style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>Error al cargar permisos: {error}</CustomText>;
  }

  return (
    <>
    <LayoutScreen>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <LogoPage />
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 15 }}>
          <View style={styles.storeName}>
            <StoreLogo style={{ width: 20, height: 20 }} />
            <CustomText style={{ fontSize: 14 }}>{currentStore.name}</CustomText>
          </View>
          <Block label="Nombre del rol" placeholder="Nombre del rol" handleChangeRole={handleChangeRole} field={"name"}/>
          <Block label="Descripción del rol" placeholder="Descripción del rol" handleChangeRole={handleChangeRole} field={"description"}/>
          <View>
            <CustomText style={styles.permissionsTitle}>Permisos</CustomText>
            <CustomText style={styles.permissionsDescription}>Estos permisos se aplicarán al role que está siendo creado.</CustomText>
            
            <View style={{ gap: 15 }}>
              {Object.keys(groupedPermissions).map((resource) => {
                const currentSelection = selectedPermissions[resource] ?? { create: false, read: false, update: false, delete: false };

                return (
                  <PermissionSection
                    key={resource}
                    module={resource}
                    title={resource.charAt(0).toUpperCase() + resource.slice(1)} 
                    availableActions={groupedPermissions[resource] as (keyof Permission)[]}
                    permissions={currentSelection}
                    onPermissionsChange={handlePermissionsChange}
                  />
                );
              })}
            </View>
          </View>
        </View>
        
              
        <Button
          title="Guardar rol"
          disabled={loadingRoles}
          onPress={() => {
            handleCreateRole()
          }}
          style={{ marginTop: 30, marginBottom: 20 }}
          />
      </ScrollView>
    </LayoutScreen>
    <CustomAlert visible={alert.visible} message={alert.message} onClose={() => setAlert({ visible: false, message: '' })} />
    </>
  )
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  storeName: { padding: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgb(155, 155, 155)', borderStyle: 'dashed' },
  permissionsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  permissionsDescription: { fontSize: 12, color: 'rgb(158, 158, 158)', marginBottom: 10 },
});