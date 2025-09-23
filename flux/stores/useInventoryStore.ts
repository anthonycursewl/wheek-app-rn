import { create } from "zustand";
import { Inventory } from "@flux/entities/Inventory";
import { InventoryActions } from "@flux/Actions/InventoryActions";

interface InventoryStore {
    loading: boolean;
    error: string | null;
    inventories: Inventory[];
    skip: number;
    take: number;
    hasMore: boolean;

    // Actions
    _inventoryAttempt: () => void;
    _inventoryFailure: (error: string) => void;
    _inventoryGetAllSuccess: (response: Inventory[]) => void;

    dispatch: (action: { type: InventoryActions; payload?: any }) => void;
    clearStore: () => void;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
    loading: false,
    error: null,
    inventories: [],
    skip: 0,
    take: 10,
    hasMore: true,

    _inventoryAttempt: () => {
        set({ loading: true, error: null })
    },

    _inventoryFailure: (error: string) => {
        set({ loading: false, error })
    },

    _inventoryGetAllSuccess: (response: Inventory[]) => {
        set({ loading: false, 
            inventories: get().inventories.length === 0 ? response : [...get().inventories, ...response], 
            skip: response.length,
            hasMore: response.length >= get().take
        })
    },

    dispatch: (action: { type: InventoryActions; payload?: any }) => {
        switch (action.type) {
            case InventoryActions.INVENTORY_ATTEMPT:
                return get()._inventoryAttempt()
            case InventoryActions.INVENTORY_FAILURE:
                return get()._inventoryFailure(action.payload.error)
            case InventoryActions.INVENTORY_GET_ALL_SUCCESS:
                return get()._inventoryGetAllSuccess(action.payload.response)
        }
    },
    clearStore: () => {
        set({
            loading: false,
            error: null,
            inventories: [],
            skip: 0,
            take: 10,
            hasMore: true,
        })
    },
}))