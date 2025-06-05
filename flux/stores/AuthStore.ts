import { create } from 'zustand';
import { LoginActions } from '../Actions/LoginActions';

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    _loginAttempt: () => void;
    _loginSuccess: () => void;
    _loginFailure: (payload: string) => void;
    dispatch: (action: { type: string; payload?: any }) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  loading: false,
  error: '',
  _loginAttempt: () => {
    set({
      isAuthenticated: false,
      loading: true,
      error: null,
    });
  },

  _loginSuccess: () => {
    set({
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  },

  _loginFailure: (payload: string) => {
    set({
      isAuthenticated: false,
      loading: false,
      error: payload,
    });
  },

  dispatch: (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case LoginActions.LOGIN_ATTEMPT:
        get()._loginAttempt(); 
        break;
      case LoginActions.LOGIN_SUCCESS:
        get()._loginSuccess();
        break;
      case LoginActions.LOGIN_FAILURE:
        get()._loginFailure(action.payload.error);
        break;
      default:
        console.warn(`Acción desconocida: ${action.type}`);
    }
  },
}));

export default useAuthStore;