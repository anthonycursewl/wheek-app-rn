import React from 'react';
import { View, Switch, StyleSheet } from "react-native";
import CustomText from "@components/CustomText/CustomText";
import { Action } from '@flux/entities/Action';

export type Permission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  manage: boolean;
  report?: boolean;
};

export type Permissions = {
  [resource: string]: Permission;
};

const ACTION_LABELS: Record<Action, string> = {
  read: 'Ver',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
  manage: 'Gestionar',
  report: 'Reportes'
};

const ACTION_DESCRIPTIONS: Record<Action, string> = {
  read: 'Permite ver los elementos de este módulo.',
  create: 'Permite crear nuevos elementos.',
  update: 'Permite editar elementos existentes.',
  delete: 'Permite eliminar elementos.',
  manage: 'Acceso completo a la gestión del módulo.',
  report: 'Acceso a reportes y estadísticas.'
};

type PermissionSectionProps = {
  module: string;
  title: string;
  availableActions: Action[];
  permissions: Permission;
  onPermissionsChange: (module: string, newPermissions: Permission) => void;
};

const PermissionSection: React.FC<PermissionSectionProps> = ({
  module,
  title,
  availableActions,
  permissions,
  onPermissionsChange,
}) => {
  const safePermissions = permissions || {};
  const safeOnPermissionsChange = onPermissionsChange || (() => {});

  return (
    <View style={styles.section}>
      <CustomText style={styles.sectionTitle}>{title}</CustomText>
      {availableActions.map((action) => {
        const isEnabled = safePermissions[action as keyof Permission];

        return (
          <View key={action} style={styles.permissionRow}>
            <View style={styles.textContainer}>
              <CustomText style={styles.permissionLabel}>
                {ACTION_LABELS[action] || action}
              </CustomText>
              <CustomText style={styles.permissionsDescription}>
                {ACTION_DESCRIPTIONS[action] || 'Permiso de acceso'}
              </CustomText>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={() => {
                const updatedPermissions = {
                  ...safePermissions,
                  [action]: !isEnabled,
                };
                safeOnPermissionsChange(module, updatedPermissions);
              }}
              trackColor={{ false: '#E0E0E0', true: 'rgba(94, 36, 255, 0.3)' }}
              thumbColor={isEnabled ? '#5E24FF' : '#9E9E9E'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        );
      })}
    </View>
  );
};

export { PermissionSection };

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'rgb(59, 59, 59)',
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  permissionLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  permissionsDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
