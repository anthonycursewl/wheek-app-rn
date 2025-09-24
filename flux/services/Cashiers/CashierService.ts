import { WheekConfig } from "config/config.wheek.breadriuss";
import { secureFetch } from "hooks/http/useFetch";

export const CashierService = {
    async getAllCashiers(store_id: string, page: number, limit: number, queryParams: string): Promise<{ data: any | null, error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/cashiers/all?store_id=${store_id}&skip=${page}&take=${limit}&${queryParams}`,
                method: 'GET',
            }
        })
    
        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    async createCashier(cashier: any): Promise<{ data: any | null, error: string | null }> {
        if (!cashier.name || !cashier.email || !cashier.store_id) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }
        
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/cashiers/create`,
                method: 'POST',
                body: cashier
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
        
        return { data: data.value, error: null };
    },

    async updateCashier(cashier: any, store_id: string): Promise<{ data: any | null, error: string | null }> {
        if (!cashier.name || !cashier.email || !cashier.store_id || !cashier.id) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }

        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/cashiers/update/${cashier.id}?store_id=${store_id}`,
                method: 'PUT',
                body: cashier,
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    },

    async deleteCashier(cashier_id: string, store_id: string): Promise<{ data: any | null, error: string | null }> {
        if (!cashier_id) return { data: null, error: 'El id del cajero es obligatorio! Intenta de nuevo.' }

        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/cashiers/delete/${cashier_id}?store_id=${store_id}`,
                method: 'DELETE',
                disableContentType: true,
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    }
}
