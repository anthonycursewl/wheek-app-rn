export interface Provider {
    id: string;
    name: string;
    description?: string | null;
    store_id: string;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    contact_phone: string | null;
    contact_email: string | null;
    is_active: boolean;
}