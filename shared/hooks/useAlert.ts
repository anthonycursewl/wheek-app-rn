import { useState, useCallback } from 'react';
import { CustomAlertProps } from '../components/CustomAlert';

type AlertOptions = Omit<CustomAlertProps, 'visible' | 'onClose' | 'onConfirm'>;

export const useAlert = () => {
  const [alertState, setAlertState] = useState<CustomAlertProps>({
    visible: false,
    message: '',
    type: 'info',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: false,
    showConfirm: true,
    isLoading: false,
    onClose: () => {},
    onConfirm: () => {}
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState(prev => ({
      ...prev,
      ...options,
      visible: true,
    }));
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const showSuccess = useCallback((message: string, options: Partial<AlertOptions> & { onConfirm?: () => void } = {}) => {
    showAlert({
      ...options,
      message,
      type: 'success',
    });
  }, [showAlert]);

  const showError = useCallback((message: string, options: Partial<AlertOptions> = {}) => {
    showAlert({
      ...options,
      message,
      type: 'error',
    });
  }, [showAlert]);

  const showWarning = useCallback((message: string, options: Partial<AlertOptions> = {}) => {
    showAlert({
      ...options,
      message,
      type: 'warning',
    });
  }, [showAlert]);

  const showInfo = useCallback((message: string, options: Partial<AlertOptions> = {}) => {
    showAlert({
      ...options,
      message,
      type: 'info',
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
