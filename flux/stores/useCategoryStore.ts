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
    _categorySuccessUpdate: (category: Category) => void;
    _categorySuccessDelete: (category: Category) => void;
    _categoryRefreshSuccess: (response: Category[]) => void;
    _categoryLoadMoreSuccess: (response: Category[]) => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;

    // clear store
    clearStore: () => void;    
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
            categories: [category, ...get().categories]
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

    _categorySuccessUpdate: (category: Category) => {
        const categories = get().categories
        const updatedCategories = categories.map(cat => 
            cat.id === category.id 
                ? category 
                : cat
        )
        set({
            categories: updatedCategories,
            loading: false,
            error: null
        })
    },

    _categorySuccessDelete: (category: Category) => {
        const categories = get().categories
        const updatedCategories = categories.filter(cat => cat.id !== category.id)
        set({
            categories: updatedCategories,
            loading: false,
            error: null
        })
    },

    _categoryRefreshSuccess: (response: Category[]) => {
        set({
            loading: false,
            error: null,
            categories: response, 
            skip: response.length, 
            hasMore: response.length >= get().take,
        });
    },

    // Esta acción AÑADE categorías. Ideal para la paginación (onEndReached).
    _categoryLoadMoreSuccess: (response: Category[]) => {
        set((state) => ({
            loading: false,
            error: null,
            categories: [...state.categories, ...response],
            skip: response.length, 
            hasMore: response.length >= get().take,
        }));
    },

    // clear store
    clearStore: () => {
        set({
            loading: false,
            error: null,
            categories: [],
            skip: 0,
            take: 10,
            hasMore: true
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
            case CategoryActions.CATEGORY_SUCCESS_UPDATE:
                get()._categorySuccessUpdate(action.payload.response)
                break;
            case CategoryActions.CATEGORY_SUCCESS_DELETE:
                get()._categorySuccessDelete(action.payload.response)
                break;
            case CategoryActions.CATEGORY_REFRESH_SUCCESS:
                get()._categoryRefreshSuccess(action.payload.response)
                break;
            case CategoryActions.CATEGORY_LOAD_MORE_SUCCESS:
                get()._categoryLoadMoreSuccess(action.payload.response)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 