interface UserRole {
    id: string;
    created_at: string;
    store_id: string;
    is_active: boolean;
    role: any;
    role_id: string;
    updated_at: string;
    user_id: string;
}

export interface User {
    id: string;
    name: string;
    last_name: string;
    password: string;
    role: string;
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
