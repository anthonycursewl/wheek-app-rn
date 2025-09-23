import { Provider } from "../entities/Provider";

export enum ProviderActions {
    PROVIDER_ATTEMPT = 'PROVIDER_ATTEMPT',    
    PROVIDER_SUCCESS = 'PROVIDER_SUCCESS',
    PROVIDER_FAILURE = 'PROVIDER_FAILURE',
    GET_ALL_PROVIDERS_ATTEMPT = 'GET_ALL_PROVIDERS_ATTEMPT',
    GET_ALL_PROVIDERS_SUCCESS = 'GET_ALL_PROVIDERS_SUCCESS',
    GET_ALL_PROVIDERS_FAILURE = 'GET_ALL_PROVIDERS_FAILURE',
    UPDATE_PROVIDER_SUCCESS = 'UPDATE_PROVIDER_SUCCESS',
    SOFT_DELETE_PROVIDER_SUCCESS = 'SOFT_DELETE_PROVIDER_SUCCESS',
    LOAD_MORE_PROVIDERS_SUCCESS = 'LOAD_MORE_PROVIDERS_SUCCESS'
}

export const providerAttemptAction = () => ({
  type: ProviderActions.PROVIDER_ATTEMPT,
});

export const providerSuccessAction = (response: Provider) => ({
  type: ProviderActions.PROVIDER_SUCCESS,
  payload: { response },
});

export const providerFailureAction = (error: string) => ({
  type: ProviderActions.PROVIDER_FAILURE,
  payload: { error },
});

export const getAllProvidersAttemptAction = () => ({
    type: ProviderActions.GET_ALL_PROVIDERS_ATTEMPT
})

export const getAllProvidersSuccessAction = (response: Provider[]) => ({
    type: ProviderActions.GET_ALL_PROVIDERS_SUCCESS,
    payload: { response }
})

export const loadMoreProvidersSuccessAction = (response: Provider[]) => ({
  type: ProviderActions.LOAD_MORE_PROVIDERS_SUCCESS,
  payload: { response }
})

export const getAllProvidersFailureAction = (error: string) => ({
    type: ProviderActions.GET_ALL_PROVIDERS_FAILURE,
    payload: { error }
})

export const updateProviderSuccessAction = (response: Provider) => ({
    type: ProviderActions.UPDATE_PROVIDER_SUCCESS,
    payload: { response }
})

export const softDeleteProviderSuccessAction = (response: Provider) => ({
    type: ProviderActions.SOFT_DELETE_PROVIDER_SUCCESS,
    payload: { response }
})


    