import { create } from "zustand";
import { StoreData } from "../entities/Store";
import { CustomAlertProps } from "shared/components/CustomAlert";

type AlertOptions = Partial<Omit<CustomAlertProps, 'visible'>>;

export interface Cotizacion {
    fuente: string;
    nombre: string;
    compra: number | null;
    venta: number | null;
    promedio: number;
    fechaActualizacion: string;
}

const initialAlertState: CustomAlertProps = {
  visible: false,
  message: '',
  onClose: () => {},
};

interface GlobalStore {
    currentStore: StoreData;
    setCurrentStore: (store: StoreData) => void;
    clearStore: () => void;
    cotizaciones: Cotizacion[];
    setCotizaciones: (cotizaciones: Cotizacion[]) => void;

    // Bottom tabs global state
    activeTab: string | null;
    setActiveTab: (tabId: string) => void;

    // Custom Exit Alert State
    isExitAlertVisible: boolean;
    showExitAlert: () => void;
    hideExitAlert: () => void;

    alertState: CustomAlertProps;
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
    showSuccess: (message: string, options?: AlertOptions) => void;
    showError: (message: string, options?: AlertOptions) => void;
    showResponse: (message: string, options?: AlertOptions) => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
    currentStore: {} as StoreData,
    setCurrentStore: (store: StoreData) => set({ currentStore: store }),
    clearStore: () => set({ cotizaciones: [] }),
    alertState: initialAlertState,
    cotizaciones: [],
    setCotizaciones: (cotizaciones: Cotizacion[]) => set({ cotizaciones }),

    // Bottom tabs global state
    activeTab: null,
    setActiveTab: (tabId: string) => set({ activeTab: tabId }),

    // Custom Exit Alert State
    isExitAlertVisible: false,
    showExitAlert: () => set({ isExitAlertVisible: true }),
    hideExitAlert: () => set({ isExitAlertVisible: false }),

    showAlert: (options: AlertOptions) => {
        set({
            alertState: {
                ...initialAlertState,
                ...options,
                visible: true,
            }
        });
    },

    hideAlert: () => {
        const { alertState } = get();
        if (typeof alertState.onClose === 'function') {
            alertState.onClose();
        }
        set(state => ({
            alertState: { ...state.alertState, visible: false }
        }));
    },
    
    showSuccess: (message: string, options: AlertOptions = {}) => {
        get().showAlert({ ...options, message });
    },

    showError: (message: string, options: AlertOptions = {}) => {
        get().showAlert({ ...options, message });
    },
    showResponse: (message: string, options: AlertOptions = {}) => {
        setTimeout(() => {
            get().showAlert({ ...options, message });
        }, 650);
    }
}));