import { Product, ProductSearchResult } from "@flux/entities/Product";
import { secureFetch } from "hooks/http/useFetch";
import { WheekConfig } from "config/config.wheek.breadriuss";

export const ProductService = {
    createProduct: async (product: Omit<Product, 'id' | 'created_at'>): Promise<{ data: Product | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/create`,
                method: 'POST',
                body: product,
                stringify: true
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    },

    async updateProduct(product: Product): Promise<{ data: Product | null, error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/update`,
                method: 'POST',
                body: product,
                stringify: true
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    },

    getAllProducts: async (store_id: string, skip: number, take: number, queryParams: string): Promise<{ data: Product[] | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/get/all?store_id=${store_id}&skip=${skip}&take=${take}&${queryParams}`,
                method: 'GET',
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    },

    deleteProduct: async (product_id: string, store_id: string): Promise<{ data: Product | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/delete/${product_id}?store_id=${store_id}`,
                method: 'DELETE',
                disableContentType: true,
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    search: async (store_id: string, term: string): Promise<{ data: ProductSearchResult[] | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/search?store_id=${store_id}&q=${term}`,
                method: 'GET',
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    }
}