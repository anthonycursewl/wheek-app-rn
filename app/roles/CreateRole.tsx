import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router, useLocalSearchParams } from "expo-router";

// Components
import LayoutScreen from "@components/Layout/LayoutScreen";
import CustomText from "@components/CustomText/CustomText";
import Input from "@components/Input/Input";
import Button from "@components/Buttons/Button";
import { PermissionSection, Permission, Permissions } from "@components/dashboard/roles/components/PermissionSection";
import CustomAlert from "shared/components/CustomAlert";

// Hooks and Stores
import { useGlobalStore } from "@flux/stores/useGlobalStore";
import { usePermissionStore } from "@flux/stores/usePermissionStore";
import { useRoleStore } from "@flux/stores/useRoleStore";
import { useAlert } from "shared/hooks/useAlert";

// Services
import { RoleService } from "@flux/services/Roles/RoleService";

// Types
import { Role } from "@flux/entities/Role";

// Constants
const INITIAL_PERMISSIONS = {
  products: { create: false, read: false, update: false, delete: false, manage: false },
  categories: { create: false, read: false, update: false, delete: false, manage: false },
  providers: { create: false, read: false, update: false, delete: false, manage: false },
  roles: { create: false, read: false, update: false, delete: false, manage: false },
  stores: { create: false, read: false, update: false, delete: false, manage: false },
  manage: { create: false, read: false, update: false, delete: false, manage: false },
} as const;

const CreateRole = () => {
  // Navigation and Mode
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isUpdateMode = mode === 'update';

  // Store hooks
  const { currentStore } = useGlobalStore();
  const { 
    groupedPermissions, 
    fetchPermissions, 
    loading: loadingPermissions, 
    error: errorPermissions 
  } = usePermissionStore();
  
  const { 
    dispatch, 
    loading: loadingRoles, 
    error: errorRoles, 
    selectedRole 
  } = useRoleStore();
  
  const { showSuccess, showError, hideAlert } = useAlert();

  // Local state
  const [role, setRole] = useState({ 
    name: '', 
    description: '' 
  });
  
  const [selectedPermissions, setSelectedPermissions] = useState<Permissions>(
    JSON.parse(JSON.stringify(INITIAL_PERMISSIONS))
  );

  // Load permissions when component mounts
  useEffect(() => {
    if (currentStore?.id) {
      fetchPermissions(currentStore.id).catch(error => {
        console.error('Error loading permissions:', error);
        showError('Error al cargar los permisos. Por favor, intente de nuevo.');
      });
    }
  }, [currentStore?.id, fetchPermissions, showError]);

  // Initialize form when in update mode
  useEffect(() => {
    if (isUpdateMode && selectedRole) {
      try {
        setRole({
          name: selectedRole.name || '',
          description: selectedRole.description || '',
        });

        if (selectedRole.permissions) {
          const permissions = parsePermissionsFromAPI(
            selectedRole.permissions.map(p => `${p.permission.resource}:${p.permission.action}`)
          );
          setSelectedPermissions(permissions);
        }
      } catch (error) {
        console.error('Error initializing update form:', error);
        showError('Error al cargar los datos del rol. Por favor, intente de nuevo.');
      }
    }
  }, [isUpdateMode, selectedRole, showError]);

  // Handle API errors
  useEffect(() => {
    if (errorRoles) {
      showError(errorRoles);
      // Clear the error after showing it
      setTimeout(() => dispatch({ type: 'CLEAR_ERROR' }), 100);
    }
  }, [errorRoles, showError, dispatch]);

  // Permission parsing utilities
  const parsePermissionsFromAPI = useCallback((permissionsArray: string[]): Permissions => {
    const statePermissions = JSON.parse(JSON.stringify(INITIAL_PERMISSIONS));
    
    permissionsArray.forEach(permissionString => {
      try {
        const [resource, action] = permissionString.split(':');
        if (resource && action && statePermissions[resource]) {
          statePermissions[resource][action as keyof Permission] = true;
        }
      } catch (error) {
        console.error('Error parsing permission:', permissionString, error);
      }
    });
    
    return statePermissions;
  }, []);

  const parsePermissionsForAPI = useCallback((permissions: Permissions): string[] => {
    const permissionsArray: string[] = [];
    
    Object.entries(permissions).forEach(([resource, actions]) => {
      Object.entries(actions).forEach(([action, isEnabled]) => {
        if (isEnabled) {
          permissionsArray.push(`${resource}:${action}`);
        }
      });
    });
    
    return permissionsArray;
  }, []);

  // Event handlers
  const handlePermissionsChange = useCallback((module: string, newPermissions: Permission) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [module]: { ...newPermissions }
    }));
  }, []);

  const handleChangeRole = useCallback((text: string, field: 'name' | 'description') => {
    setRole(prev => ({
      ...prev,
      [field]: text
    }));
  }, []);

  const handleSubmit = async () => {
    if (!currentStore?.id) {
      return showError("No se ha podido identificar la tienda actual.");
    }

    // Validate inputs
    if (!role.name.trim()) {
      return showError('El nombre del rol es obligatorio.');
    }

    const permissions = parsePermissionsForAPI(selectedPermissions);
    if (permissions.length === 0) {
      return showError('Debes seleccionar al menos un permiso.');
    }

    try {
      dispatch({ type: 'ROLE_ATTEMPT' });

      const rolePayload: Omit<Role, 'id' | 'created_at' | 'is_active'> & 
        Partial<Pick<Role, 'id' | 'created_at' | 'is_active'>> = {
        name: role.name.trim(),
        description: role.description.trim(),
        store_id: currentStore.id,
        permissions,
      };

      // Add update-specific fields
      if (isUpdateMode && selectedRole) {
        rolePayload.id = selectedRole.id;
        rolePayload.created_at = selectedRole.created_at || new Date();
        rolePayload.is_active = selectedRole.is_active ?? true;
      }

      const { data, error } = isUpdateMode && selectedRole?.id
        ? await RoleService.update(rolePayload as Role, currentStore.id)
        : await RoleService.createRole(rolePayload);

      if (error) throw new Error(error);
      if (!data) throw new Error('No se recibieron datos del servidor');

      dispatch({
        type: isUpdateMode ? 'ROLE_UPDATE_SUCCESS' : 'ROLE_CREATE_SUCCESS',
        payload: data
      });

      showSuccess(`¡Rol ${isUpdateMode ? 'actualizado' : 'creado'} exitosamente!`, {
        onConfirm: () => {
          hideAlert();
          if (router.canGoBack()) router.back();
        },
      });
    } catch (error) {
      console.error('Error saving role:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      dispatch({ type: 'ROLE_FAILURE', payload: errorMessage });
      showError(`Error al ${isUpdateMode ? 'actualizar' : 'crear'} el rol: ${errorMessage}`);
    }
  };

  // Loading and error states
  if (loadingPermissions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <CustomText style={styles.loadingText}>Cargando permisos...</CustomText>
      </View>
    );
  }

  if (errorPermissions) {
    return (
      <LayoutScreen>
        <View style={styles.errorContainer}>
          <CustomText style={styles.errorText}>
            Error al cargar los permisos: {errorPermissions}
          </CustomText>
          <Button 
            title="Reintentar" 
            onPress={() => currentStore?.id && fetchPermissions(currentStore.id)}
            style={styles.retryButton}
          />
        </View>
      </LayoutScreen>
    );
  }

  // Main render
  return (
    <LayoutScreen>
      <ScrollView style={styles.container}>
        <CustomText style={styles.title}>
          {isUpdateMode ? 'Editar Rol' : 'Nuevo Rol'}
        </CustomText>

        {/* Role Name */}
        <View style={styles.inputGroup}>
          <CustomText style={styles.label}>Nombre del Rol</CustomText>
          <Input
            placeholder="Ej: Administrador"
            value={role.name}
            onChangeText={(text) => handleChangeRole(text, 'name')}
            style={styles.input}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <CustomText style={styles.label}>Descripción</CustomText>
          <Input
            placeholder="Describe las funciones de este rol"
            value={role.description}
            onChangeText={(text) => handleChangeRole(text, 'description')}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
          />
        </View>

        {/* Permissions */}
        <View style={styles.permissionsContainer}>
          <CustomText style={styles.sectionTitle}>Permisos</CustomText>
          
          {Object.entries(groupedPermissions || {}).map(([module, permissions]) => (
            <PermissionSection
              key={module}
              module={module}
              permissions={permissions}
              selectedPermissions={selectedPermissions[module] || {}}
              onPermissionsChange={(newPermissions) => 
                handlePermissionsChange(module, newPermissions)
              }
            />
          ))}
        </View>

        {/* Submit Button */}
        <Button
          title={isUpdateMode ? 'Actualizar Rol' : 'Crear Rol'}
          onPress={handleSubmit}
          loading={loadingRoles}
          disabled={loadingRoles}
          style={styles.submitButton}
        />
      </ScrollView>
    </LayoutScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  permissionsContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 16,
    minWidth: 150,
  },
});

export default CreateRole;
