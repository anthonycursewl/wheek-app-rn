import { Provider } from "@flux/entities/Provider";
// constans
import { WheekConfig } from "config/config.wheek.breadriuss";
import { secureFetch } from "hooks/http/useFetch";

export const ProviderService = {
    async createProvider(provider: Omit<Provider, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<{ data: any | null, error: string | null }> {
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
        
        return { data: data.value, error: null };
    },

    async getAllProviders(store_id: string, page: number, limit: number, queryParams: string): Promise<{ data: any | null, error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/providers/all?store_id=${store_id}&skip=${page}&take=${limit}&${queryParams}`,
                method: 'GET',
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
    
        return { data: data.value, error: null };
    },

    async update(provider: Omit<Provider, 'created_at' | 'updated_at' | 'deleted_at'>, store_id: string): Promise<{ data: Provider | null, error: string | null }> {
        if (!provider.name || !provider.store_id || !provider.id || !provider.contact_email || !provider.contact_phone || !provider.description) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }

        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/providers/update/${provider.id}?store_id=${store_id}`,
                method: 'PUT',
                body: provider,
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    },

    async delete(provider_id: string, store_id: string): Promise<{ data: Provider | null, error: string | null }> {
        if (!provider_id) return { data: null, error: 'El id del proveedor es obligatorio! Intenta de nuevo.' }

        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/providers/delete/${provider_id}?store_id=${store_id}`,
                method: 'DELETE',
                disableContentType: true,
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    }
}