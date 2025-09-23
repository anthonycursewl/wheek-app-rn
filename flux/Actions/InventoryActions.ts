import { Inventory } from "@flux/entities/Inventory";

export enum InventoryActions {
    INVENTORY_ATTEMPT = 'INVENTORY_ATTEMPT',    
    INVENTORY_FAILURE = 'INVENTORY_FAILURE',
    INVENTORY_GET_ALL_SUCCESS = 'INVENTORY_GET_ALL_SUCCESS',
}

export const inventoryAttemptAction = () => ({
  type: InventoryActions.INVENTORY_ATTEMPT,
});

export const inventoryFailureAction = (error: string) => ({
  type: InventoryActions.INVENTORY_FAILURE,
  payload: { error },
});

export const inventoryGetAllSuccessAction = (response: Inventory[]) => ({
  type: InventoryActions.INVENTORY_GET_ALL_SUCCESS,
  payload: { response },
});





    