import { ProductSearchResult } from "./Product";

export interface ReceptionLineItem {
    id: string;
    quantity: number;
    cost_price: number;
    product: {
        name: string;
        unit_type?: string;
    };
}

export interface ReceptionItemPayload {
    product_id: string;
    quantity: number;
    cost_price: number;
}

export interface ReceptionPayload {
    store_id: string;
    user_id: string;
    provider_id?: string;
    notes?: string;
    items: ReceptionItemPayload[];
}

export interface Reception {
    id: string;
    notes: string | null;
    is_active: boolean;
    items: ReceptionLineItem[];
    reception_date: Date;
    status: string;
    user: {
        name: string;
    };
    provider: {
        name: string;
    } | null;
}