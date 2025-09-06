import { WheekConfig } from "config/config.wheek.breadriuss"
import { secureFetch } from "hooks/http/useFetch"
import { ApiPermission } from "@flux/stores/usePermissionStore"
import { Role, RoleWithPermissions } from "@flux/entities/Role"

export const RoleService = {
    getAllRoles: async (store_id: string, take: number, skip: number): Promise<{ data: Role[] | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/get/roles/all?store_id=${store_id}&skip=${skip}&take=${take}`,
                method: 'GET',
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    getAllPermissions: async (store_id: string): Promise<{ data: ApiPermission[] | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/get/permissions/all?store_id=${store_id}`,
                method: 'GET',
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    createRole: async (role: Omit<Role, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'is_active'>): Promise<{ data: Role | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/create/role?store_id=${role.store_id}`,
                method: 'POST',
                body: role,
                stringify: true
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    getRoleById: async (role_id: string, store_id: string): Promise<{ data: RoleWithPermissions | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/get/roles/${role_id}?store_id=${store_id}`,
                method: 'GET',
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },
}