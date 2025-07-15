export interface FormProductData {
    name: string;
    barcode: string;
    store_id: string;
    ficha: {
      condition: 'UND' | 'KG';
      cost: string;
      benchmark: string;
      tax: boolean;
    };
    category_id: string;
    provider_id: string;
}