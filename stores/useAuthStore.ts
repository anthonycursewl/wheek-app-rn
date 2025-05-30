import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isAuthenticated: boolean;
  user: {
    email: string | null;
    token: string | null;
  };
  login: (email: string, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: {
        email: null,
        token: null,
      },
      login: (email: string, token: string) =>
        set({
          isAuthenticated: true,
          user: { email, token },
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: { email: null, token: null },
        }),
    }),
    {
      name: 'auth-storage', // nombre de la clave en AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook personalizado para facilitar el uso del store
// Hook personalizado para facilitar el uso del store
export const useAuth = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  
  // Envolvemos el login en un manejador de errores
  const handleLogin = async (email: string, token: string) => {
    try {
      await login(email, token);
      return true;
    } catch (error) {
      console.error('Error en useAuth.login:', error);
      return false;
    }
  };
  
  return {
    isAuthenticated,
    user,
    login: handleLogin,
    logout,
  };
};
