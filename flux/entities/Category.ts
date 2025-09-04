export interface Category {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    store_id: string;
    is_active: boolean
    deleted_at: Date | null;
}