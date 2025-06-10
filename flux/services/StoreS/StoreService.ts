import { WheekConfig } from "@/config/config.wheek.breadriuss";
import { StoreData } from "@/flux/entities/Store";
import { secureFetch } from "@/hooks/http/useFetch";

export const StoreService = {
    async createStore(dataObj: Omit<StoreData, 'id' | 'created_at' | 'is_active'>): Promise<{ data: StoreData | null, error: string | null }> {
        const { data, error} = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/create`,
                method: 'POST',
                body: dataObj
            }
        })
        
        if (error) {
            return { data: null, error: error }
        }

        return { data, error: null }
    },

    async updateStore(dataObj: Omit<StoreData, 'id' | 'created_at' | 'is_active'>): Promise<{ data: StoreData | null, error: string | null }> {
        const { data, error} = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/update`,
                method: 'POST',
                body: dataObj
            }
        })
        
        if (error) {
            return { data: null, error: error }
        }

        return { data, error: null }
    },

    async getStores(user_id: string): Promise<{ data: StoreData[] | null, error: string | null }> {
        const { data, error} = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/stores/get/all/${user_id}`,
                method: 'GET',
            }
        })

        if (error) {
            return { data: null, error: error }
        }

        return { data: data.value, error: null }
    }
}