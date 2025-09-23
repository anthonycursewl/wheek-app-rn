import { Reception } from "@flux/entities/Reception";

export enum ReceptionActions {
    RECEPTION_ATTEMPT = 'RECEPTION_ATTEMPT',    
    RECEPTION_FAILURE = 'RECEPTION_FAILURE',
    RECEPTION_CREATE_SUCCESS = 'RECEPTION_CREATE_SUCCESS',
    RECEPTION_GET_ALL_SUCCESS = 'RECEPTION_GET_ALL_SUCCESS',
    RECEPTION_LOAD_MORE_SUCCESS = 'RECEPTION_LOAD_MORE_SUCCESS',
    RECEPTION_DELETE_SUCCESS = 'RECEPTION_DELETE_SUCCESS',
}

export const receptionAttemptAction = () => ({
  type: ReceptionActions.RECEPTION_ATTEMPT,
});

export const receptionCreateSuccessAction = (response: Reception) => ({
  type: ReceptionActions.RECEPTION_CREATE_SUCCESS,
  payload: { response },
});

export const receptionFailureAction = (error: string) => ({
  type: ReceptionActions.RECEPTION_FAILURE,
  payload: { error },
});

export const receptionGetAllSuccessAction = (response: Reception[]) => ({
  type: ReceptionActions.RECEPTION_GET_ALL_SUCCESS,
  payload: { response },
});

export const receptionLoadMoreSuccessAction = (response: Reception[]) => ({
  type: ReceptionActions.RECEPTION_LOAD_MORE_SUCCESS,
  payload: { response },
});

export const receptionDeleteSuccessAction = (response: Reception) => ({
  type: ReceptionActions.RECEPTION_DELETE_SUCCESS,
  payload: { response },
});





    