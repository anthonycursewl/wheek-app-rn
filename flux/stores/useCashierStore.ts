import { create } from "zustand";
import { CashierActions } from "../Actions/CashierActions";
import { CashierService } from "../services/Cashiers/CashierService";

interface CashierStore {
    loading: boolean;
    error: string | null;
    cashiers: any[];
    page: number;
    limit: number;
    hasMore: boolean;
    
    // actions
    _cashierAttempt: () => void;
    _cashierSuccess: (cashier: any) => void;
    _cashierFailure: (error: string) => void;
    _getAllCashiersAttempt: () => void;
    _getAllCashiersSuccess: (cashiers: any[], isNewPage?: boolean) => void;
    _getAllCashiersFailure: (error: string) => void;
    _updateCashierSuccess: (cashier: any) => void;
    _deleteCashierSuccess: (cashier: any) => void;
    _loadMoreCashiersSuccess: (cashiers: any[]) => void;
    resetPagination: () => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;
    
    // selected cashier
    selectedCashier: any | null;
    setSelectedCashier: (cashier: any | null) => void;

    // clear store
    clearStore: () => void;
}

export const useCashierStore = create<CashierStore>((set, get) => ({
    loading: false,
    error: null,
    cashiers: [],
    page: 1,
    limit: 10,
    hasMore: true,
    selectedCashier: null,
    setSelectedCashier: (cashier: any | null) => {
        set({
            selectedCashier: cashier
        })
    },

    _cashierAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _cashierSuccess: (cashier: any) => {
        set({
            loading: false,
            error: null,
            cashiers: [cashier, ...get().cashiers]
        })
    },

    _cashierFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _getAllCashiersAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _getAllCashiersSuccess: (newCashiers: any[]) => {
        const currentState = get();
        set({
            loading: false,
            error: null,
            cashiers: newCashiers,
            page: currentState.cashiers.length,
            hasMore: newCashiers.length >= currentState.limit
        })
    },

    _loadMoreCashiersSuccess: (newCashiers: any[]) => {
        const currentState = get();
        const updatedCashiers = [...currentState.cashiers, ...newCashiers];
        set({
            loading: false,
            error: null,
            cashiers: updatedCashiers,
            page: currentState.cashiers.length,
            hasMore: newCashiers.length >= currentState.limit
        })
    },

    _getAllCashiersFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _updateCashierSuccess: (cashier: any) => {
        const currentState = get();
        const updatedCashiers = currentState.cashiers.map(c => 
            c.id === cashier.id ? cashier : c
        );
        set({
            loading: false,
            error: null,
            cashiers: updatedCashiers
        })
    },

    _deleteCashierSuccess: (cashier: any) => {
        const currentState = get();
        const updatedCashiers = currentState.cashiers.filter(c => c.id !== cashier.id);
        set({
            loading: false,
            error: null,
            cashiers: updatedCashiers
        })
    },

    resetPagination: () => {
        set({
            page: 1,
            hasMore: true,
            cashiers: []
        })
    },

    clearStore: () => {
        set({
            loading: false,
            error: null,
            cashiers: [],
            page: 1,
            limit: 10,
            hasMore: true,
            selectedCashier: null
        })
    },

    dispatch: async (action) => {
        const currentState = get();
        
        switch (action.type) {
            case CashierActions.CASHIER_ATTEMPT:
                currentState._cashierAttempt();
                break;

            case CashierActions.CASHIER_SUCCESS:
                currentState._cashierSuccess(action.payload.response);
                break;

            case CashierActions.CASHIER_FAILURE:
                currentState._cashierFailure(action.payload.error);
                break;

            case CashierActions.GET_ALL_CASHIERS_ATTEMPT:
                currentState._getAllCashiersAttempt();
                break;

            case CashierActions.GET_ALL_CASHIERS_SUCCESS:
                currentState._getAllCashiersSuccess(action.payload.response);
                break;

            case CashierActions.LOAD_MORE_CASHIERS_SUCCESS:
                currentState._loadMoreCashiersSuccess(action.payload.response);
                break;

            case CashierActions.GET_ALL_CASHIERS_FAILURE:
                currentState._getAllCashiersFailure(action.payload.error);
                break;

            case CashierActions.UPDATE_CASHIER_SUCCESS:
                currentState._updateCashierSuccess(action.payload.response);
                break;

            case CashierActions.DELETE_CASHIER_SUCCESS:
                currentState._deleteCashierSuccess(action.payload.response);
                break;

            default:
                break;
        }
    }
}));
