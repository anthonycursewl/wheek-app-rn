export interface Product {
    id: string
    name: string;
    barcode: string;
    store_id: string;
    w_ficha: {
      condition: 'UND' | 'KG';
      cost: string;
      benchmark: string;
      tax: boolean;
    };
    category_id: string;
    provider_id: string;
    created_at: string;
}