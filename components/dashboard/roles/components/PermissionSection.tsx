import React from 'react';
import { View, Switch, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";

export type Permission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  manage: boolean;
};

export type Permissions = {
  products: Permission;
  categories: Permission;
  providers: Permission;
  roles: Permission;
  stores: Permission;
  [key: string]: Permission;
};


type PermissionSectionProps = {
  module: string;
  title: string;
  permissions: Permission;
  availableActions: (keyof Permission)[];
  onPermissionsChange: (module: string, newPermissions: Permission) => void; 
};

const actions: (keyof Permission)[] = ['read', 'create', 'update', 'delete', 'manage'];

export const PermissionSection = ({ module, title, permissions, availableActions, onPermissionsChange }: PermissionSectionProps) => {

  const handleToggle = (action: keyof Permission) => {
    const updatedPermissions = {
      ...permissions,
      [action]: !permissions[action], 
    };
    onPermissionsChange(module, updatedPermissions);
  };

  const getActionLabel = (action: keyof Permission): string => {
    switch (action) {
      case 'read': return 'Ver';
      case 'create': return 'Crear';
      case 'update': return 'Editar';
      case 'delete': return 'Eliminar';
      case 'manage': return 'Gestionar';
      default: return '';
    }
  };

  return (
    <View style={styles.section}>
      <CustomText style={styles.sectionTitle}>{title}</CustomText>

      {availableActions.map((action) => {
        const isDisabled = module === 'stores' && (action === 'create' || action === 'delete');
        
        if (isDisabled) {
          return null;
        }

        return (
          <View key={action}>
            <View style={styles.permissionRow}>
              <CustomText style={styles.permissionLabel}>{getActionLabel(action)}</CustomText>
              <Switch
                value={permissions?.[action] ?? false} 
                onValueChange={() => handleToggle(action)}
                disabled={isDisabled}
                trackColor={{ false: '#f4f3f4', true: '#7e57c2' }}
                thumbColor={permissions[action] ? '#5e35b1' : '#f4f3f4'}
              />
            </View>
            <CustomText style={styles.permissionsDescription}>
              {`Permite ${getActionLabel(action).toLocaleLowerCase()} ${title.toLowerCase()} mediante API o desde la app.`}
            </CustomText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  permissionsDescription: { fontSize: 12, color: 'rgb(158, 158, 158)', marginBottom: 10 },
  section: { backgroundColor: '#f8f8f8', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: '#e0e0e0', gap: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: 'rgb(59, 59, 59)' },
  permissionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  permissionLabel: { fontSize: 15, color: 'rgb(27, 27, 27)' }
});