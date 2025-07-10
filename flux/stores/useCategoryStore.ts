import { create } from "zustand";
import { Category } from "../entities/Category";
import { CategoryActions } from "../Actions/CategoryAction";

interface CategoryStore {
    loading: boolean;
    error: string | null;
    categories: Category[];
    
    // actions
    _categoryAttempt: () => void;
    _categorySuccess: (category: Category) => void;
    _categoryFailure: (error: string) => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    loading: false,
    error: null,
    categories: [],

    _categoryAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _categorySuccess: (category: Category) => {
        set({
            loading: false,
            error: null,
            categories: [...get().categories, category]
        })
    },

    _categoryFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    dispatch: (action: { type: string; payload?: any }) => {
        switch (action.type) {
            case CategoryActions.CATEGORY_ATTEMPT:
                get()._categoryAttempt()
                break;
            case CategoryActions.CATEGORY_SUCCESS:
                get()._categorySuccess(action.payload.response)
                break;
            case CategoryActions.CATEGORY_FAILURE:
                get()._categoryFailure(action.payload.error)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 