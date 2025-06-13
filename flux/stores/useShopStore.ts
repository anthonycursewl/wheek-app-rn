import { create } from "zustand";
import { StoreData } from "../entities/Store";
import { StoreActions } from "../Actions/StoreActions";

interface ShopStore {
    loading: boolean;
    error: string | null;
    stores: StoreData[];
    _createStore: () => void;
    _createStoreSuccess: (store: StoreData) => void;
    _createStoreFailure: (error: string) => void;
    _getStoresAttempt: () => void;
    _getStoresSuccess: (stores: StoreData[]) => void;
    _getStoresFailure: (error: string) => void;
    dispatch: (action: { type: string; payload?: any }) => void;
}

export const useShopStore = create<ShopStore>((set, get) => ({
    loading: false,
    error: null,
    stores: [],

    _createStore: () => {
        set({
            loading: true,
            error: null
        })
    },

    _createStoreSuccess: (store: StoreData) => {
        set({
            loading: false,
            error: null,
            stores: [...get().stores, store]
        })
    },

    _createStoreFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _getStoresAttempt: () => {
        set({
            loading: true,
            error: null,
        })
    },

    _getStoresSuccess: (stores: StoreData[]) => {
        set({
            loading: false,
            error: null,
            stores: [...get().stores, ...stores]
        })
    },

    _getStoresFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    dispatch: (action: { type: string; payload?: any }) => {
        switch (action.type) {
            case StoreActions.ATTEMPT_CREATE_STORE:
                get()._createStore()
                break;
            case StoreActions.CREATE_STORE_SUCCESS:
                get()._createStoreSuccess(action.payload.store)
                break;
            case StoreActions.CREATE_STORE_FAILURE:
                get()._createStoreFailure(action.payload.error)
                break;
            case StoreActions.GET_STORES_ATTEMPT:
                get()._getStoresAttempt()
                break;
            case StoreActions.GET_STORES_SUCCESS:
                get()._getStoresSuccess(action.payload.stores)
                break;
            case StoreActions.GET_STORES_FAILURE:
                get()._getStoresFailure(action.payload.error)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 