import { create } from 'zustand';
import { RoleService } from '@flux/services/Roles/RoleService';

export type ApiPermission = {
  id: number;
  resource: string;
  action: string;
  description: string;
};

type GroupedPermissions = {
  [resource: string]: string[];
};

type PermissionState = {
  groupedPermissions: GroupedPermissions;
  loading: boolean;
  error: string | null;
  fetchPermissions: (store_id: string) => Promise<void>;
};

export const usePermissionStore = create<PermissionState>((set, get) => ({
  groupedPermissions: {},
  loading: false,
  error: null,

  fetchPermissions: async (store_id: string) => {
    if (Object.keys(get().groupedPermissions).length > 0 || get().loading) {
      return;
    }

    set({ loading: true, error: null });
    const { data, error } = await RoleService.getAllPermissions(store_id);

    if (error) {
      set({ loading: false, error });
      return;
    }

    if (data) {
      const grouped = data.reduce<GroupedPermissions>((acc, permission) => {
        const { resource, action } = permission;
        if (!acc[resource]) {
          acc[resource] = [];
        }
        acc[resource].push(action);
        return acc;
      }, {});

      set({ loading: false, groupedPermissions: grouped });
    }
  },
}));