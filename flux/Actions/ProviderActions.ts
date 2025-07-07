import { Provider } from "../entities/Provider";

export enum ProviderActions {
    PROVIDER_ATTEMPT = 'PROVIDER_ATTEMPT',    
    PROVIDER_SUCCESS = 'PROVIDER_SUCCESS',
    PROVIDER_FAILURE = 'PROVIDER_FAILURE',
    GET_ALL_PROVIDERS_ATTEMPT = 'GET_ALL_PROVIDERS_ATTEMPT',
    GET_ALL_PROVIDERS_SUCCESS = 'GET_ALL_PROVIDERS_SUCCESS',
    GET_ALL_PROVIDERS_FAILURE = 'GET_ALL_PROVIDERS_FAILURE'
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

export const getAllProvidersFailureAction = (error: string) => ({
    type: ProviderActions.GET_ALL_PROVIDERS_FAILURE,
    payload: { error }
})


    