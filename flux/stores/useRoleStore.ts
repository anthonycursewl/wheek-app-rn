import { create } from "zustand";
import { Role, RoleWithPermissions } from "../entities/Role";
import { RoleActions } from "@flux/Actions/RoleActions";

interface RoleStore {
    loading: boolean;
    error: string | null;
    roles: Role[];
    skip: number;
    take: number;
    hasMore: boolean;
    
    // actions
    _roleAttempt: () => void;
    _roleFailure: (error: string) => void;

    // get all roles
    _getSuccessAllRoles: (roles: Role[], isRefreshing: boolean) => void;
    _successCreateRole: (role: Role) => void;
    _successGetRole: (role: Role) => void;
    _successUpdateRole: (role: Role) => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;
    selectedRole: RoleWithPermissions;
    setSelectedRole: (role: RoleWithPermissions) => void;

    // clear store
    clearStore: () => void;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
    loading: false,
    error: null,
    roles: [],
    skip: 0,
    take: 10,
    hasMore: true,

    selectedRole: {
        id: '',
        name: '',
        description: '',
        store_id: '',
        permissions: [],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        is_active: false
    },
    setSelectedRole: (role: RoleWithPermissions) => {
        set({
            selectedRole: role
        })
    },

    _roleAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _roleFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },
    
    _getSuccessAllRoles: (roles: Role[], isRefreshing: boolean) => {
        set({
            loading: false,
            error: null,
            roles: isRefreshing ? roles : [...get().roles, ...roles],
            skip: get().roles.length,
            hasMore: roles.length == get().take 
        })
    },
    
    _successCreateRole: (role: Role) => {
        set({
            loading: false,
            error: null,
            roles: [role, ...get().roles],
        })
    },    
    
    _successGetRole: (role: Role) => {
        set({
            loading: false,
            error: null,
        })
    },

    _successUpdateRole: (role: Role) => {
        set({
            loading: false,
            error: null,
            roles: get().roles.map(r => r.id === role.id ? role : r) 
        })
    },

    // Clear store 
    clearStore: () => {
        set({
            loading: false,
            error: null,
            roles: [],
            skip: 0,
            take: 10,
            hasMore: true
        })
    },

    dispatch: (action: { type: string; payload?: any }) => {
        switch (action.type) {
            case RoleActions.ROLE_ATTEMPT:
                get()._roleAttempt()
                break;
            case RoleActions.ROLE_FAILURE:
                get()._roleFailure(action.payload.error)
                break;
            case RoleActions.ROLE_SUCCESS_ALL:
                get()._getSuccessAllRoles(action.payload.response, action.payload.isRefreshing)
                break;
            case RoleActions.ROLE_SUCCESS_CREATE:
                get()._successCreateRole(action.payload.response)
                break;
            case RoleActions.ROLE_SUCCESS_GET:
                get()._successGetRole(action.payload.response)
                break;
            case RoleActions.ROLE_SUCCESS_UPDATE:
                get()._successUpdateRole(action.payload.response)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 