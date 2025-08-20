import { create } from "zustand";
import { Provider } from "../entities/Provider";
import { ProviderActions } from "../Actions/ProviderActions";

interface ProviderStore {
    loading: boolean;
    error: string | null;
    providers: Provider[];
    page: number;
    limit: number;
    hasMore: boolean;
    
    // actions
    _providerAttempt: () => void;
    _providerSuccess: (provider: Provider) => void;
    _providerFailure: (error: string) => void;
    _getAllProvidersAttempt: () => void;
    _getAllProvidersSuccess: (providers: Provider[], isNewPage?: boolean) => void;
    _getAllProvidersFailure: (error: string) => void;
    resetPagination: () => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;

    // clear store
    clearStore: () => void;
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
    loading: false,
    error: null,
    providers: [],
    page: 1,
    limit: 10,
    hasMore: true,

    _providerAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _providerSuccess: (provider: Provider) => {
        set({
            loading: false,
            error: null,
            providers: [provider, ...get().providers]
        })
    },

    _providerFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _getAllProvidersAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _getAllProvidersSuccess: (newProviders: Provider[], isNewPage: boolean = true) => {
        const currentState = get();
        const updatedProviders = isNewPage 
            ? [...currentState.providers, ...newProviders]
            : newProviders;
            
        set({
            loading: false,
            error: null,
            providers: updatedProviders,
            page: isNewPage ? currentState.page + 1 : 2,
            hasMore: newProviders.length === currentState.limit
        })
    },
    
    _getAllProvidersFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },
    
    resetPagination: () => {
        set({
            page: 1,
            hasMore: true,
            providers: []
        })
    },

    // Clear store 
    clearStore: () => {
        set({
            loading: false,
            error: null,
            providers: [],
            page: 1,
            limit: 10,
            hasMore: true
        })
    },

    dispatch: (action: { type: string; payload?: any }) => {
        switch (action.type) {
            case ProviderActions.PROVIDER_ATTEMPT:
                get()._providerAttempt()
                break;
            case ProviderActions.PROVIDER_SUCCESS:
                get()._providerSuccess(action.payload.response)
                break;
            case ProviderActions.PROVIDER_FAILURE:
                get()._providerFailure(action.payload.error)
                break;
            case ProviderActions.GET_ALL_PROVIDERS_ATTEMPT:
                get()._getAllProvidersAttempt()
                break;
            case ProviderActions.GET_ALL_PROVIDERS_SUCCESS:
                get()._getAllProvidersSuccess(action.payload.response)
                break;
            case ProviderActions.GET_ALL_PROVIDERS_FAILURE:
                get()._getAllProvidersFailure(action.payload.error)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 