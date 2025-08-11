import { create } from 'zustand';
import { LoginActions } from '../Actions/LoginActions';
import { User, UserResponse } from '../entities/User';
import { RegisterActions } from '@flux/Actions/RegisterActions';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    authToken: UserResponse;
    user: User | null;

    // Actions
    _loginAttempt: () => void;
    _loginSuccess: (payload: UserResponse) => void;
    _loginFailure: (payload: string) => void;
    _logoutAttempt: () => void;
    _verifySuccess: (payload: User) => void;
    
    // register actions
    _registerAttempt: () => void;
    _registerSuccess: (payload: UserResponse) => void;
    _registerFailure: (payload: string) => void;

    // errro setter
    setError: (err: string) => void;

    // dispatcher actions
    dispatch: (action: { type: string; payload?: any }) => void;

    // clear store
    clearStore: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  loading: false,
  error: '',
  authToken: {
    access_token: '',
    refresh_token: ''
  },
  user: null,

  setError: (err: string) => {
    set({
      error: err,
    });
  },
  
  _loginAttempt: () => {
    set({
      loading: true,
      error: null,
    });
  },

  _loginSuccess: (payload: UserResponse) => {
    set({
      isAuthenticated: true,
      loading: false,
      error: null,
      authToken: payload,
    });

  },

  _loginFailure: (payload: string) => {
    set({
      isAuthenticated: false,
      loading: false,
      error: payload,
      authToken: {
        access_token: '',
        refresh_token: ''
      }
    });

  },
  _logoutAttempt: () => {
    set({
      isAuthenticated: false,
      loading: false,
      error: null,
      authToken: {
        access_token: '',
        refresh_token: ''
      }
    });
  },
  
  _verifySuccess: (payload: User) => {
    set({
      isAuthenticated: true,
      loading: false,
      error: null,
      user: payload
    });
  },

  // Register Actions
  _registerAttempt: () => {
    set({
      loading: true,
      error: null,
    });
  },

  _registerSuccess: (payload: UserResponse) => {
    set({
      isAuthenticated: true,
      loading: false,
      error: null,
      authToken: payload,
    });

  },

  _registerFailure: (payload: string) => {
    set({
      isAuthenticated: false,
      loading: false,
      error: payload,
      authToken: {
        access_token: '',
        refresh_token: ''
      }
    });

  },

  clearStore: () => {
    set({
      isAuthenticated: false,
      loading: false,
      error: null,
      authToken: {
        access_token: '',
        refresh_token: ''
      },
      user: null
    });
  },

  dispatch: (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case LoginActions.LOGIN_ATTEMPT:
        get()._loginAttempt(); 
        break;
      case LoginActions.LOGIN_SUCCESS:
        get()._loginSuccess(action.payload.response);
        break;
      case LoginActions.LOGIN_FAILURE:
         get()._loginFailure(action.payload.error);
        break;
      case LoginActions.LOGOUT_ATTEMPT:
        get()._logoutAttempt();
        break;
      case LoginActions.VERIFY_SUCCESS:
        get()._verifySuccess(action.payload.response);
        break;
      case RegisterActions.REGISTER_ATTEMPT:
        get()._registerAttempt();
        break;
      case RegisterActions.REGISTER_SUCCESS:
        get()._registerSuccess(action.payload.response);
        break;
      case RegisterActions.REGISTER_FAILURE:
        get()._registerFailure(action.payload.error);
        break;
      default:
        console.warn(`Acción desconocida: ${action.type}`);
    }
  },
}));

export default useAuthStore;