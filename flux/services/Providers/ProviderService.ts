import { Provider } from "@flux/entities/Provider";
// constans
import { WheekConfig } from "config/config.wheek.breadriuss";
import { secureFetch } from "hooks/http/useFetch";

export const ProviderService = {
    async createProvider(provider: Omit<Provider, 'id' | 'created_at'>): Promise<{ data: any | null, error: string | null }> {
        if (!provider.name || !provider.store_id) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }
        
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/providers/create`,
                method: 'POST',
                body: provider
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
        
        return { data, error: null };
    },

    async getAllProviders(store_id: string, page: number, limit: number): Promise<{ data: any | null, error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/providers/all?store_id=${store_id}&skip=${(page - 1) * limit}&take=${limit}`,
                method: 'GET',
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
    
        return { data: data, error: null };
    }
}