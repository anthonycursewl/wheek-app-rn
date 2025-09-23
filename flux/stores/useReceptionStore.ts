import { create } from "zustand";
import { ReceptionActions } from "@flux/Actions/ReceptionActions";
import { Reception } from "@flux/entities/Reception";

interface ReceptionStore {
    loading: boolean;
    error: string | null;
    receptions: Reception[];
    skip: number;
    take: number;
    hasMore: boolean;

    // Actions
    _receptionAttempt: () => void;
    _receptionFailure: (error: string) => void;
    _receptionCreateSuccess: (response: any) => void;
    _getAllReceptionsSuccess: (response: Reception[]) => void;
    _loadMoreReceptionsSuccess: (response: Reception[]) => void;
    _receptionDeleteSuccess: (response: Reception) => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;

    // clear store
    clearStore: () => void;    
}

export const useReceptionStore = create<ReceptionStore>((set, get) => ({
    loading: false,
    error: null,
    receptions: [],
    skip: 0,
    take: 10,
    hasMore: true,

    _receptionAttempt: () => {
        set({
            loading: true,
            error: null,
        })
    },
    
    _receptionFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _receptionCreateSuccess: (response: Reception) => {
        set({
            loading: false,
            error: null,
            receptions: [response, ...get().receptions],
        })
    },

    _getAllReceptionsSuccess: (response: Reception[]) => {
        set({
            loading: false,
            error: null,
            receptions: response,
            skip: response.length,
            hasMore: response.length >= get().take,
        })
    },

    _loadMoreReceptionsSuccess: (response: Reception[]) => {
        const currentState = get();
        set({
            loading: false,
            error: null,
            receptions: [...currentState.receptions, ...response],
            skip: currentState.skip + response.length,
            hasMore: response.length >= currentState.take,
        })
    },

    _receptionDeleteSuccess: (response: Reception) => {
        const currentState = get();
        const receptionIdToDelete = response?.id;
        
        if (!receptionIdToDelete) {
            console.warn('Invalid reception ID provided for deletion');
            return;
        }
        
        const deleteIndex = currentState.receptions.findIndex(reception => reception.id === receptionIdToDelete);
        
        if (deleteIndex !== -1) {
            const updatedReceptions = [...currentState.receptions];
            updatedReceptions.splice(deleteIndex, 1);
            
            set({
                loading: false,
                error: null,
                receptions: updatedReceptions,
            });
        } else {
            console.warn(`Reception with ID ${receptionIdToDelete} not found in store`);
        }
    },

    // Clear store
    clearStore: () => {
        set({
            loading: false,
            error: null,
            receptions: [],
            skip: 0,
            take: 10,
            hasMore: true,
        })
    },

    dispatch: (action: { type: string; payload?: any }) => {
        switch (action.type) {
            case ReceptionActions.RECEPTION_ATTEMPT:
                get()._receptionAttempt()
                break;
            case ReceptionActions.RECEPTION_FAILURE:
                get()._receptionFailure(action.payload.error)
                break;
            case ReceptionActions.RECEPTION_CREATE_SUCCESS:
                get()._receptionCreateSuccess(action.payload.response)
                break;
            case ReceptionActions.RECEPTION_DELETE_SUCCESS:
                get()._receptionDeleteSuccess(action.payload.response)
                break;
            case ReceptionActions.RECEPTION_GET_ALL_SUCCESS:
                get()._getAllReceptionsSuccess(action.payload.response)
                break;
            case ReceptionActions.RECEPTION_LOAD_MORE_SUCCESS:
                get()._loadMoreReceptionsSuccess(action.payload.response)
                break;
            default:
                console.warn(`Acción desconocida: ${action.type}`);
        }
    }
})) 