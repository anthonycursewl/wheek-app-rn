import { UserResponse } from "../entities/User";

export enum RegisterActions {
    REGISTER_ATTEMPT = 'REGISTER_ATTEMPT',    
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
}

export const registerAttemptAction = () => ({
  type: RegisterActions.REGISTER_ATTEMPT,
});

export const registerSuccessAction = (response: UserResponse) => ({
  type: RegisterActions.REGISTER_SUCCESS,
  payload: { response },
});

export const registerFailureAction = (error: string) => ({
  type: RegisterActions.REGISTER_FAILURE,
  payload: { error },
});



    