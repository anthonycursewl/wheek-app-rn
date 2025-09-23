export interface AdjustmentLineItem {
    id: string;
    name: string;
    barcode: string;
    quantity: number;
    cost: number;
    current_stock?: number;
}

export interface AdjustmentPayload {
    store_id: string;
    user_id: string;
    reason: string;
    notes: string;
    items: AdjustmentItemPayload[];
}

export interface AdjustmentItemPayload {
    product_id: string;
    quantity: number;
}

export interface Adjustment {
    id: string;
    store_id: string;
    user_id: string;
    reason: string;
    notes?: string;
    items: AdjustmentLineItem[];
    created_at: string;
    updated_at: string;
}

export interface AdjustmentWithDetails {
    id: string;
    notes?: string;
    store_id: string;
    adjustment_date: Date;
    reason: string;
    user: {
        name: string;
    }
    items: {
        quantity: number;
        product: {
            name: string;
            w_ficha: {
                condition: string;
                cost: number;
                benchmark: number;
                tax: boolean;
            }
        }
    }[];
}

export interface ProductSearchResult {
    id: string;
    name: string;
    barcode: string;
    cost: number;
}

