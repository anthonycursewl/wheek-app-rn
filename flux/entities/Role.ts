export interface Role {
    id: string;
    name: string;
    store_id: string;
    description?: string;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
    is_active: boolean;

    permissions?: string[];
}

export interface RoleWithPermissions extends Omit<Role, 'permissions'> {
    permissions: Array<{ permission: { resource: string, action: string } }>;
}