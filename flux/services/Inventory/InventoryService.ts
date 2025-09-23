import { Inventory } from "@flux/entities/Inventory";
import { secureFetch } from "hooks/http/useFetch";
import { WheekConfig } from "config/config.wheek.breadriuss";

export const InventoryService = {
    async getInventory(store_id: string, skip: number, take: number): Promise<{ data: Inventory[] | null, error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/inventory/get/all?store_id=${store_id}&skip=${skip}&take=${take}`,
                method: 'GET',
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    }  
}
