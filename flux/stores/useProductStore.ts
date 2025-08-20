import { create } from "zustand";
import { Product } from "../entities/Product";
import { ProductActions } from "../Actions/ProductActions";

interface ProductStore {
    loading: boolean;
    error: string | null;
    products: Product[];
    skip: number;
    take: number;
    hasMore: boolean;

    // actions
    _productCreateAttempt: () => void;
    _productCreateSuccess: (product: Product) => void;
    _productCreateFailure: (error: string) => void;
    _getProductsSuccess: (products: Product[], isRefreshing?: boolean) => void;
    _updateProduct(product: Product): void;
    _deleteProduct(product: Product): void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;

    // clear store
    clearStore: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    loading: false,
    error: null,
    products: [],
    skip: 0,
    take: 10,
    hasMore: true,

    _productCreateAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _productCreateSuccess: (product: Product) => {
        set({
            loading: false,
            error: null,
            products: [product, ...get().products]
        })
    },

    _productCreateFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _getProductsSuccess: (products: Product[], isRefreshing = false) => {
        set({
            loading: false,
            error: null,
            products: isRefreshing ? products : [...get().products, ...products],
            skip: isRefreshing ? products.length : get().skip + products.length,
            hasMore: products.length >= get().take
        })
    },

    _updateProduct: (product: Product) => {
        set({
            loading: false,
            error: null,
            products: get().products.reduce<Product[]>((acc, p) => {
                if (p.id === product.id) {
                    acc.push(product);
                } else {
                    acc.push(p);
                }
                return acc;
            }, [])
        })
    },

    _deleteProduct: (product: Product) => {
        const products = [...get().products];
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products.splice(index, 1);
        }
        set({
            loading: false,
            error: null,
            products
        });
    },

    // Clear store 
    clearStore: () => {
        set({
            loading: false,
            error: null,
            products: [],
            skip: 0,
            take: 10,
            hasMore: true
        })
    },

    dispatch: (action: { type: string; payload?: any }) => {
        switch (action.type) {
            case ProductActions.PRODUCT_CREATE_ATTEMPT:
                get()._productCreateAttempt()
                break;
            case ProductActions.PRODUCT_CREATE_SUCCESS:
                get()._productCreateSuccess(action.payload.response)
                break;
            case ProductActions.PRODUCT_CREATE_FAILURE:
                get()._productCreateFailure(action.payload.error)
                break;
            case 'GET_PRODUCTS_SUCCESS':
                get()._getProductsSuccess(
                    action.payload.response,
                    action.payload.isRefreshing
                )
                break;
            case 'UPDATE_PRODUCT_SUCCESS':
                get()._updateProduct(action.payload.response)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 