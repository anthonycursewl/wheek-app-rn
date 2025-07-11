export interface FormProductData {
    name: string;
    barcode: string;
    store_id: string;
    ficha: {
      condition: string;
      cost: string;
      benchmark: string;
      tax: boolean;
    };
    category: string;
}