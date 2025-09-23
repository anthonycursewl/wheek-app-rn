import { secureFetch } from "hooks/http/useFetch"
import { WheekConfig } from "config/config.wheek.breadriuss"
import { Reception, ReceptionPayload } from "@flux/entities/Reception"

export const ReceptionService = {
    createReception: async (reception: ReceptionPayload): Promise<{ data: Reception | null, error: string | null }> => {
        if (!reception.store_id || !reception.user_id || reception.items.length === 0) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' }
        }

        const { data, error } = await secureFetch({
            options: {
                method: 'POST',
                url: `${WheekConfig.API_BASE_URL}/receptions/create`,
                body: reception,
            }
        })

        if (error) return { data: null, error: error }
        return { data: data.value, error: null }
    },

    getAllReceptions: async (store_id: string, skip: number, take: number, queryParams: string = ''): Promise<{ data: Reception[] | null, error: string | null }> => {
        let url = `${WheekConfig.API_BASE_URL}/receptions/get/all?store_id=${store_id}&skip=${skip}&take=${take}`;    
        if (queryParams) url += `&${queryParams}`;
        
        const { data, error } = await secureFetch({
            options: {
                url: url,
                method: 'GET',
            }
        })

        if (error) return { data: null, error: error }
        return { data: data.value, error: null }
    },

    deleteReception: async (reception_id: string, store_id: string, isSoftDelete: boolean): Promise<{ data: Reception | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                method: 'DELETE',
                url: `${WheekConfig.API_BASE_URL}/receptions/delete/${reception_id}?store_id=${store_id}&isSoft_delete=${isSoftDelete}`,
                disableContentType: true,
            }
        })

        if (error) return { data: null, error: error }
        return { data: data.value, error: null }
    },
}