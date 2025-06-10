import { create } from 'zustand';
import { LoginActions } from '../Actions/LoginActions';
import { User, UserResponse } from '../entities/User';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    authToken: UserResponse;
    user: User | null;
    _loginAttempt: () => void;
    _loginSuccess: (payload: UserResponse) => void;
    _loginFailure: (payload: string) => void;
    _logoutAttempt: () => void;
    _verifySuccess: (payload: User) => void;
    dispatch: (action: { type: string; payload?: any }) => void;
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
  _loginAttempt: () => {
    set({
      loading: true,
      error: null,
    });
  },

  _loginSuccess: async (payload: UserResponse) => {
    set({
      isAuthenticated: true,
      loading: false,
      error: null,
      authToken: payload,
    });

  },

  _loginFailure: async (payload: string) => {
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
  _logoutAttempt: async () => {
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

  dispatch: async (action: { type: string; payload?: any }) => {
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
      default:
        console.warn(`Acción desconocida: ${action.type}`);
    }
  },
}));

export default useAuthStore;