import { StoreData } from "../entities/Store"
export enum StoreActions {
    ATTEMPT_CREATE_STORE = 'ATTEMPT_CREATE_STORE',
    CREATE_STORE_SUCCESS = 'CREATE_STORE_SUCCESS',
    CREATE_STORE_FAILURE = 'CREATE_STORE_FAILURE',
    GET_STORES_ATTEMPT = 'GET_STORES_ATTEMPT',
    GET_STORES_SUCCESS = 'GET_STORES_SUCCESS',
    GET_STORES_FAILURE = 'GET_STORES_FAILURE',
} 

export const createStoreAttemptAction = () => ({
    type: StoreActions.ATTEMPT_CREATE_STORE,
})

export const createStoreSuccessAction = (store: StoreData) => ({
    type: StoreActions.CREATE_STORE_SUCCESS,
    payload: { store },
})

export const createStoreFailureAction = (error: string) => ({
    type: StoreActions.CREATE_STORE_FAILURE,
    payload: { error },
})

export const getStoresAttemptAction = () => ({
    type: StoreActions.GET_STORES_ATTEMPT,
})

export const getStoresSuccessAction = (stores: StoreData[]) => ({
    type: StoreActions.GET_STORES_SUCCESS,
    payload: { stores },
})

export const getStoresFailureAction = (error: string) => ({
    type: StoreActions.GET_STORES_FAILURE,
    payload: { error },
})
