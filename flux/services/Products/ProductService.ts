import { Product } from "@flux/entities/Product";
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

    getAllProducts: async (store_id: string, skip: number, take: number): Promise<{ data: Product[] | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/get/all?store_id=${store_id}&skip=${skip}&take=${take}`,
                method: 'GET',
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    },

    deleteProduct: async (product_id: string): Promise<{ data: Product | null, error: string | null }> => {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/products/delete`,
                method: 'POST',
                body: { product_id },
                stringify: true
            }
        })

        if (error) {
            return { data: null, error: error };
        }

        return { data: data.value, error: null };
    }
}