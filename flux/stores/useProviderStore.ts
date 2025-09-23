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
    _updateProviderSuccess: (provider: Provider) => void;
    _softDeleteProviderSuccess: (provider: Provider) => void;
    _loadMoreProvidersSuccess: (providers: Provider[]) => void;
    resetPagination: () => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;
    
    // selected provider
    selectedProvider: Provider | null;
    setSelectedProvider: (provider: Provider | null) => void;

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
    selectedProvider: null,
    setSelectedProvider: (provider: Provider | null) => {
        set({
            selectedProvider: provider
        })
    },

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

    _getAllProvidersSuccess: (newProviders: Provider[]) => {
        const currentState = get();
        set({
            loading: false,
            error: null,
            providers: newProviders,
            page: currentState.providers.length,
            hasMore: newProviders.length >= currentState.limit
        })
    },

    _loadMoreProvidersSuccess: (newProviders: Provider[]) => {
        const currentState = get();
        const updatedProviders = [...currentState.providers, ...newProviders];
        set({
            loading: false,
            error: null,
            providers: updatedProviders,
            page: currentState.providers.length,
            hasMore: newProviders.length >= currentState.limit
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

    _updateProviderSuccess: (provider: Provider) => {
        set({
            loading: false,
            error: null,
            providers: get().providers.map(p => p.id === provider.id ? provider : p)
        })
    },

    _softDeleteProviderSuccess: (provider: Provider) => {
        set({
            loading: false,
            error: null,
            providers: get().providers.filter(p => p.id !== provider.id)
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
            case ProviderActions.LOAD_MORE_PROVIDERS_SUCCESS:
                get()._loadMoreProvidersSuccess(action.payload.response)
                break;
            case ProviderActions.GET_ALL_PROVIDERS_FAILURE:
                get()._getAllProvidersFailure(action.payload.error)
                break;
            case ProviderActions.UPDATE_PROVIDER_SUCCESS:
                get()._updateProviderSuccess(action.payload.response)
                break;
            case ProviderActions.SOFT_DELETE_PROVIDER_SUCCESS:
                get()._softDeleteProviderSuccess(action.payload.response)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 