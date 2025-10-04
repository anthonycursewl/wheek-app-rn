import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

// --- Componentes personalizados, Hooks y Entidades (sin cambios) ---
import LayoutScreen from "@components/Layout/LayoutScreen";
import CustomText from "@components/CustomText/CustomText";
import LogoPage from "@components/LogoPage/LogoPage";
import Input from "@components/Input/Input";
import Button from "@components/Buttons/Button";
import { PermissionSection, Permission, Permissions } from "@components/dashboard/roles/components/PermissionSection";
import CustomAlert from "shared/components/CustomAlert";
import StoreLogo from "svgs/StoreLogo";
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { usePermissionStore } from "@flux/stores/usePermissionStore";
import { useRoleStore } from "@flux/stores/useRoleStore";
import { roleAttemptAction, roleFailureAction, roleSuccessCreateAction, roleSuccessUpdateAction } from "@flux/Actions/RoleActions";
import { RoleService } from "@flux/services/Roles/RoleService";
import { RoleWithPermissions } from "@flux/entities/Role";

// --- COMPONENTE REUTILIZABLE ---
const Block = ({ label, placeholder, value, handleChangeRole, field }: { 
  label: string; 
  placeholder: string;
  value: string;
  handleChangeRole: (text: string, field: 'name' | 'description') => void; 
  field: 'name' | 'description';
}) => (
  <View style={{ gap: 10 }}>
    <CustomText>{label}</CustomText>
    <Input 
      placeholder={placeholder} 
      value={value} 
      onChangeText={(text) => handleChangeRole(text, field)}
    />
  </View>
);

// --- FUNCIONES COMPARTIDAS ---
const parsePermissionsForAPI = (permissions: Permissions): string[] => {
  const permissionsArray: string[] = [];
  Object.keys(permissions).forEach(resource => {
    Object.keys(permissions[resource]).forEach(action => {
      if (permissions[resource][action as keyof Permission]) {
        permissionsArray.push(`${resource}:${action}`);
      }
    });
  });
  return permissionsArray;
};

// ====================================================================
//  1. COMPONENTE DEDICADO A LA LÓGICA DE CREACIÓN
// ====================================================================
const CreateRole = () => {
  const { currentStore } = useGlobalStore();
  const { groupedPermissions, loading: loadingPermissions } = usePermissionStore();
  const { dispatch, loading: loadingRoles } = useRoleStore();
  const { hideAlert, showSuccess } = useGlobalStore()

  const [role, setRole] = useState({ name: '', description: '' });
  const [selectedPermissions, setSelectedPermissions] = useState<Permissions>({
    providers: { create: false, read: false, update: false, delete: false, manage: false },
    products: { create: false, read: false, update: false, delete: false, manage: false },
    categories: { create: false, read: false, update: false, delete: false, manage: false },
    roles: { create: false, read: false, update: false, delete: false, manage: false },
    stores: { create: false, read: false, update: false, delete: false, manage: false },
  });

  const handleChangeRole = (text: string, field: 'name' | 'description') => {
    setRole(prev => ({ ...prev, [field]: text }));
  };

  const handlePermissionsChange = (module: string, newPermissions: Permission) => {
    setSelectedPermissions(prev => ({ ...prev, [module]: newPermissions }));
  };

  const handleCreate = async () => {
    const permissions = parsePermissionsForAPI(selectedPermissions);

    if (!role.name.trim() || !role.description.trim()) return dispatch(roleFailureAction('El nombre y la descripción son obligatorios.'));
    if (permissions.length === 0) return dispatch(roleFailureAction('Debes seleccionar al menos un permiso.'));
    if (!currentStore?.id) return dispatch(roleFailureAction("No se ha podido identificar la tienda actual."));

    dispatch(roleAttemptAction());
    
    const createPayload = {
      name: role.name,
      description: role.description,
      store_id: currentStore.id,
      permissions,
    };
    
    const { data, error } = await RoleService.createRole(createPayload);

    if (error) {
      dispatch(roleFailureAction(error));
    } 
    
    if (data) {
      dispatch(roleSuccessCreateAction(data));
      showSuccess(`¡Rol ${data.name} creado exitosamente!`, { icon: 'success', onClose: () => router.back(), duration: 1000 });
    }
  };

  if (loadingPermissions) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 15 }}>
            <CustomText style={{ fontSize: 16, color: 'gray', marginBottom: 10 }}>
                Se está creando el registro en la tienda actual: <CustomText style={{ fontWeight: 'bold' }}>{currentStore?.name}</CustomText>
            </CustomText>
            <CustomText style={{fontSize: 20, fontWeight: 'bold'}}>Crear Rol</CustomText>
            
            <Block label="Nombre del rol" placeholder="Ej: Vendedor" value={role.name} handleChangeRole={handleChangeRole} field="name" />
            <Block label="Descripción del rol" placeholder="Ej: Encargado de las ventas" value={role.description} handleChangeRole={handleChangeRole} field="description" />
            
            <View>
                <CustomText style={styles.permissionsTitle}>Permisos</CustomText>
                <CustomText style={styles.permissionsDescription}>Selecciona los permisos que se aplicarán al nuevo rol.</CustomText>
                
                <View style={{ gap: 15 }}>
                    {groupedPermissions && Object.keys(groupedPermissions).map((resource) => (
                    <PermissionSection
                        key={resource}
                        module={resource}
                        title={resource.charAt(0).toUpperCase() + resource.slice(1)}
                        availableActions={groupedPermissions[resource] as (keyof Permission)[]}
                        permissions={selectedPermissions[resource] || {}}
                        onPermissionsChange={handlePermissionsChange}
                    />
                    ))}
                </View>
            </View>
        </View>
        
        <Button
            title="Crear Rol"
            disabled={loadingRoles}
            onPress={handleCreate}
            style={{ marginTop: 30, marginBottom: 20 }}
        />
    </ScrollView>
  );
};

// ====================================================================
//  2. COMPONENTE DEDICADO A LA LÓGICA DE ACTUALIZACIÓN
// ====================================================================
interface UpdateRoleProps {
  roleToEdit: RoleWithPermissions;
}

const UpdateRole = ({ roleToEdit }: UpdateRoleProps) => {
    const { currentStore } = useGlobalStore();
    const { groupedPermissions, loading: loadingPermissions } = usePermissionStore();
    const { dispatch, loading: loadingRoles } = useRoleStore();
    const { showSuccess, hideAlert, showResponse } = useGlobalStore()

    const [role, setRole] = useState({ name: '', description: '' });
    const [selectedPermissions, setSelectedPermissions] = useState<Permissions>({
      providers: { create: false, read: false, update: false, delete: false, manage: false },
      products: { create: false, read: false, update: false, delete: false, manage: false },
      categories: { create: false, read: false, update: false, delete: false, manage: false },
      roles: { create: false, read: false, update: false, delete: false, manage: false },
      stores: { create: false, read: false, update: false, delete: false, manage: false },
    });

    useEffect(() => {
        setRole({
            name: roleToEdit.name,
            description: roleToEdit.description || '',
        });

        const basePermissions = groupedPermissions ? Object.keys(groupedPermissions).reduce((acc, key) => ({...acc, [key]: {}}), {}) : {};

        const permissionsForState = (roleToEdit.permissions || []).reduce((acc, p) => {
            const { resource, action } = p.permission;
            if (!acc[resource]) {
                acc[resource] = {
                  create: true,
                  read: true,
                  update: true,
                  delete: true,
                  manage: true,
                };
            }
            acc[resource][action as keyof Permission] = true;
            return acc;
        }, basePermissions as Permissions);
        
        setSelectedPermissions(permissionsForState);
    }, [roleToEdit, groupedPermissions]);


    const handleChangeRole = (text: string, field: 'name' | 'description') => {
        setRole(prev => ({ ...prev, [field]: text }));
    };
    
    const handlePermissionsChange = (module: string, newPermissions: Permission) => {
        setSelectedPermissions(prev => ({ ...prev, [module]: newPermissions }));
    };

    const updateRoleIj = async () => {
      if (loadingRoles) return;
      const permissions = parsePermissionsForAPI(selectedPermissions);
      
      dispatch(roleAttemptAction());
        const updatePayload = {
            name: role.name,
            description: role.description,
            store_id: currentStore.id,
            is_active: roleToEdit.is_active,
            permissions,
          };
        
        const { data, error } = await RoleService.update(roleToEdit.id, updatePayload, currentStore.id);
        if (error) {
          dispatch(roleFailureAction(error));
        }

        if (data) {
          dispatch(roleSuccessUpdateAction({ ...data, permissions: [] }));
        }
    } 

    const handleUpdate = async () => {
        showSuccess('¿Estás seguro que deseas actualizar este rol?', {
          requiresConfirmation: true,
          onConfirm: async () => {
              await updateRoleIj();
              hideAlert();

              showResponse('¡Rol actualizado exitosamente!', {
                icon: 'success',
                duration: 700,
                autoHide: true,
                onClose: () => {
                  router.back();
                  router.back();
                },
              });
          },
          isLoading: loadingRoles
        });
        
      }
    
    if (loadingPermissions) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
      <>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 15 }}>
                <View style={styles.storeName}>
                    <StoreLogo style={{ width: 20, height: 20 }} />
                    <CustomText style={{ fontSize: 14 }}>{currentStore?.name}</CustomText>
                </View>
                <CustomText style={{fontSize: 20, fontWeight: 'bold'}}>Actualizar Rol</CustomText>
                
                <Block label="Nombre del rol" placeholder="Ej: Vendedor" value={role.name} handleChangeRole={handleChangeRole} field="name" />
                <Block label="Descripción del rol" placeholder="Ej: Encargado de las ventas" value={role.description} handleChangeRole={handleChangeRole} field="description" />
                
                <View>
                    <CustomText style={styles.permissionsTitle}>Permisos</CustomText>
                    <CustomText style={styles.permissionsDescription}>Modifica los permisos que se aplicarán a este rol.</CustomText>
                    
                    <View style={{ gap: 15 }}>
                        {groupedPermissions && Object.keys(groupedPermissions).map((resource) => (
                        <PermissionSection
                            key={resource}
                            module={resource}
                            title={resource.charAt(0).toUpperCase() + resource.slice(1)}
                            availableActions={groupedPermissions[resource] as (keyof Permission)[]}
                            permissions={selectedPermissions[resource] || {}}
                            onPermissionsChange={handlePermissionsChange}
                        />
                        ))}
                    </View>
                </View>
            </View>
            
            <Button
                title="Guardar Cambios"
                disabled={loadingRoles}
                onPress={handleUpdate}
                style={{ marginTop: 30, marginBottom: 20 }}
            />
        </ScrollView>
        </>
    );
};

// ====================================================================
//  3. COMPONENTE PRINCIPAL QUE ACTÚA COMO ENRUTADOR
// ====================================================================
export default function ManageRole() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const { selectedRole, error, dispatch, loading } = useRoleStore();
  const { hideAlert, alertState, showError } = useGlobalStore();
  const { fetchPermissions, error: errorPermissions } = usePermissionStore();
  const { currentStore } = useGlobalStore();
  
  useEffect(() => {
    if (currentStore?.id) {
      fetchPermissions(currentStore.id);
    }
  }, [currentStore?.id]);

  useEffect(() => {
    if (error) {
      showError(error, {
        icon: 'error',
      });
    }

    return () => {
      dispatch(roleFailureAction(''));
    }
  }, [error])

  const isUpdateMode = mode === 'update';

  if (isUpdateMode && !selectedRole) {
    return (
        <LayoutScreen>
            <CustomText style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                Error: No se ha seleccionado ningún rol para editar. Por favor, vuelve atrás e inténtalo de nuevo.
            </CustomText>
        </LayoutScreen>
    );
  }

  if (errorPermissions) {
    return (
      <LayoutScreen>
        <CustomText style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
          Error al cargar permisos: {errorPermissions}
        </CustomText>
      </LayoutScreen>
    );
  }

  return (
    <>
      <LayoutScreen>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <LogoPage />
        </View>
        {isUpdateMode ? <UpdateRole roleToEdit={selectedRole!} /> : <CreateRole />}
      </LayoutScreen>
      <CustomAlert {...alertState} onClose={hideAlert} isLoading={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  storeName: { padding: 10, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgb(155, 155, 155)', borderStyle: 'dashed' },
  permissionsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  permissionsDescription: { fontSize: 12, color: 'rgb(158, 158, 158)', marginBottom: 10 },
});
