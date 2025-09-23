import { useState, useCallback } from 'react';
import { CustomAlertProps } from '../components/CustomAlert';

// 1. CAMBIO PRINCIPAL: Ajustamos los tipos.
// Solo necesitamos omitir 'visible', ya que el hook lo controla.
// Permitimos que 'onClose' y 'onConfirm' se puedan pasar como opciones.
type AlertOptions = Partial<Omit<CustomAlertProps, 'visible'>>;

// Guardamos el estado inicial para poder resetearlo fácilmente.
const initialState: CustomAlertProps = {
  visible: false,
  message: '',
  onClose: () => {},
};

export const useAlert = () => {
  const [alertState, setAlertState] = useState<CustomAlertProps>(initialState);

  // 2. MEJORA: `showAlert` ahora resetea el estado anterior.
  // Esto evita que un `onConfirm` o `onClose` de una alerta anterior
  // se quede "pegado" en la siguiente.
  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      ...initialState, // Resetea al estado inicial
      ...options,      // Aplica las nuevas opciones
      visible: true,   // Muestra la alerta
    });
  }, []);

  // 3. MEJORA: `hideAlert` ahora ejecuta el callback `onClose` del estado.
  const hideAlert = useCallback(() => {
    // Primero, llama a la función onClose que está actualmente en el estado
    if (typeof alertState.onClose === 'function') {
      alertState.onClose();
    }
    // Luego, oculta el modal
    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  }, [alertState.onClose]); // Dependemos de la función actual onClose

  // 4. SIMPLIFICACIÓN: Las firmas de las funciones son más limpias.
  // Ya no necesitan la intersección `& { onConfirm... }` porque AlertOptions ya lo permite.
  const showSuccess = useCallback((message: string, options: AlertOptions = {}) => {
    showAlert({
      ...options,
      message,
    });
  }, [showAlert]);

  const showError = useCallback((message: string, options: AlertOptions = {}) => {
    showAlert({
      ...options,
      message,
    });
  }, [showAlert]);

  const showWarning = useCallback((message: string, options: AlertOptions = {}) => {
    showAlert({
      ...options,
      message,
    });
  }, [showAlert]);

  const showInfo = useCallback((message: string, options: AlertOptions = {}) => {
    showAlert({
      ...options,
      message,
    });
  }, [showAlert]);

  const setLoading = useCallback((isLoading: boolean) => {
    setAlertState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    setLoading,
  };
};