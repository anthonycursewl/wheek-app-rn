import { Category } from "@flux/entities/Category";
// constans
import { WheekConfig } from "config/config.wheek.breadriuss";
import { secureFetch } from "hooks/http/useFetch";

export const CategoryService = {
    async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any | null, error: string | null }> {
        if (!category.name || !category.store_id) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/categories/create`,
                method: 'POST',
                body: category
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
        
        return { data, error: null};
    },

    async getAllCategories(store_id: string, skip: number, take: number): Promise<{ data: any | null, error: string | null }> {
        if (!store_id) {
            return { data: null, error: 'El ID del almacén es obligatorio! Intenta de nuevo.' }
        }
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/categories/all/${store_id}?skip=${skip}&take=${take}`,
                method: 'GET',
            }
        })
        
        if (error) {
            return { data: null, error: error }
        }
        
        return { data: data.value, error: null }
    }
}