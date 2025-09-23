import { Cotizacion } from "@flux/stores/useGlobalStore";

export const CotizacionService = {
    async getAllCotizaciones (): Promise<{ data: Cotizacion[] | null, error: string | null }> {
        try {
            const response = await fetch('https://ve.dolarapi.com/v1/dolares')
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json()
            return { data: data, error: null }
        } catch (error: any) {
            return { error: error.message, data: null }
        }
    }
}