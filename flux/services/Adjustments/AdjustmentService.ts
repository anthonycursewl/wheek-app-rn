import { AdjustmentPayload, AdjustmentWithDetails } from "@flux/entities/Adjustment";
import { secureFetch } from "@hooks/http/useFetch";
import { WheekConfig } from "config/config.wheek.breadriuss";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cacheDirectory, readAsStringAsync, downloadAsync } from 'expo-file-system/legacy';
import { format } from 'date-fns';

export class AdjustmentService {
    static async createAdjustment(adjustment: AdjustmentPayload, store_id: string): Promise<{ data: AdjustmentWithDetails | null; error: string | null }> {
        console.log("AdjustmentService.createAdjustment", adjustment);
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/adjustments/create?store_id=${store_id}`,
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

    static async generateAdjustmentRangeReport(storeId: string, startDate: string, endDate: string): Promise<{ data: any | null; error: string | null }> {
        const token = await AsyncStorage.getItem('token');
        const url = `${WheekConfig.API_BASE_URL}/adjustments/report/range?store_id=${storeId}&startDate_range=${startDate}&endDate_range=${endDate}`;   

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error al descargar el reporte: ${response.statusText}`);
          }

          const blob = await response.blob();
          return { data: blob, error: null };

        } catch (error) {
            console.error('Error al descargar el reporte:', error);
            const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al descargar el reporte';
            return { data: null, error: errorMessage };
        }
    }
}
