import { AdjustmentPayload, Adjustment, AdjustmentWithDetails } from "@flux/entities/Adjustment";
import { secureFetch } from "@hooks/http/useFetch";
import { WheekConfig } from "config/config.wheek.breadriuss";

export class AdjustmentService {
    static async createAdjustment(adjustment: AdjustmentPayload): Promise<{ data: AdjustmentWithDetails | null; error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/adjustments/create?store_id=${adjustment.store_id}`,
                method: 'POST',
                body: adjustment,
            }
        });
        if (error) return { data: null, error };
        return { data: data.value, error: null };
    }

    static async getAdjustments(storeId: string, skip: number, take: number, queryParams: string): Promise<{ data: AdjustmentWithDetails[] | null; error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/adjustments/get/all?store_id=${storeId}&skip=${skip}&take=${take}&${queryParams}`,
                method: 'GET',
            }
        });
        if (error) return { data: null, error };
        return { data: data.value, error: null };
    }

    static async getAdjustmentById(id: string, store_id: string, skip: number, take: number): Promise<{ data: AdjustmentWithDetails | null; error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/adjustments/get/${id}?store_id=${store_id}&skip=${skip}&take=${take}`,
                method: 'GET',
            }
        });
        if (error) return { data: null, error };
        return { data: data.value, error: null };
    }
}
