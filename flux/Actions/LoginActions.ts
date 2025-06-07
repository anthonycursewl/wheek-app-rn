import { User, UserResponse } from "../entities/User";

export enum LoginActions {
    LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',    
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    LOGOUT_ATTEMPT = 'LOGOUT_ATTEMPT',
    VERIFY_SUCCESS = 'VERIFY_SUCCESS',
}

export const loginAttemptAction = () => ({
  type: LoginActions.LOGIN_ATTEMPT,
});

export const loginSuccessAction = (response: UserResponse) => ({
  type: LoginActions.LOGIN_SUCCESS,
  payload: { response },
});

export const loginFailureAction = (error: string) => ({
  type: LoginActions.LOGIN_FAILURE,
  payload: { error },
});

export const simulateLoginSuccessAction = () => ({
  type: LoginActions.LOGIN_SUCCESS,
});

export const logoutAttemptAction = () => ({
  type: LoginActions.LOGOUT_ATTEMPT,
});

export const verifySuccessAction = (response: User) => ({
  type: LoginActions.VERIFY_SUCCESS,
  payload: { response },
});

    