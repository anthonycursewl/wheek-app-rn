export interface Provider {
    id: string;
    name: string;
    description?: string | null;
    store_id: string;
    created_at: Date;
    contact_phone: string | null;
    contact_email: string | null;
    is_active: boolean;
}