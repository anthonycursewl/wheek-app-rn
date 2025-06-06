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
}

export interface UserResponse {
    refresh_token: string;
    access_token: string;
}
