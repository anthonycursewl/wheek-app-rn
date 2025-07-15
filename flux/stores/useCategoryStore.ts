import { create } from "zustand";
import { Category } from "../entities/Category";
import { CategoryActions } from "../Actions/CategoryAction";

interface CategoryStore {
    loading: boolean;
    error: string | null;
    categories: Category[];
    skip: number;
    take: number;
    hasMore: boolean;
    
    // actions
    _categoryAttempt: () => void;
    _categorySuccess: (category: Category) => void;
    _categoryFailure: (error: string) => void;
    _categorySuccessAll: (categories: Category[]) => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
    loading: false,
    error: null,
    categories: [],
    skip: 0,
    take: 10,
    hasMore: true,

    _categoryAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },
    
    _categoryFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _categorySuccess: (category: Category) => {
        set({
            loading: false,
            error: null,
            categories: [...get().categories, category]
        })
    },

    _categorySuccessAll: (categories: Category[]) => {
        set({
            loading: false,
            error: null,
            categories: [...get().categories, ...categories],
            skip: categories.length,
            hasMore: categories.length >= get().take
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
            case CategoryActions.CATEGORY_SUCCESS_ALL:
                get()._categorySuccessAll(action.payload.categories)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 