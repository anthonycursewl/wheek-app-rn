interface UserRole {
    id: string;
    created_at: string;
    store_id: string;
    is_active: boolean;
    role: {
        id: string;
        created_at: string;
        description: string;
        is_active: boolean;
        name: string;
        permissions: any[];
        store_id: string;
        updated_at: string;
    };
    role_id: string;
    updated_at: string;
    user_id: string;
}

export interface User {
    id: string;
    name: string;
    last_name: string;
    password: string;
    created_at: string;
    is_active: boolean;
    icon_url: string;
    username: string;
    email: string;
    user_roles: UserRole[]
}

export interface UserResponse {
    refresh_token: string;
    access_token: string;
}
