export enum LoginActions {
    LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',    
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
}

export const loginAttemptAction = () => ({
  type: LoginActions.LOGIN_ATTEMPT,
});

export const loginSuccessAction = () => ({
  type: LoginActions.LOGIN_SUCCESS,
});

export const loginFailureAction = (error: string) => ({
  type: LoginActions.LOGIN_FAILURE,
  payload: { error },
});
    