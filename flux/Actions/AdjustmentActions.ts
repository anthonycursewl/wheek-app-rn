import { Adjustment, AdjustmentWithDetails } from "@flux/entities/Adjustment";

export const ADJUSTMENT_ATTEMPT = 'ADJUSTMENT_ATTEMPT';
export const ADJUSTMENT_CREATE_SUCCESS = 'ADJUSTMENT_CREATE_SUCCESS';
export const ADJUSTMENT_FAILURE = 'ADJUSTMENT_FAILURE';
export const ADJUSTMENT_FETCH_SUCCESS = 'ADJUSTMENT_FETCH_SUCCESS';
export const ADJUSTMENT_FETCH_MORE_SUCCESS = 'ADJUSTMENT_FETCH_MORE_SUCCESS';

export interface AdjustmentAttemptAction {
    type: typeof ADJUSTMENT_ATTEMPT;
}

export interface AdjustmentCreateSuccessAction {
    type: typeof ADJUSTMENT_CREATE_SUCCESS;
    payload: AdjustmentWithDetails;
}

export interface AdjustmentFailureAction {
    type: typeof ADJUSTMENT_FAILURE;
    payload: string;
}

export interface AdjustmentFetchSuccessAction {
    type: typeof ADJUSTMENT_FETCH_SUCCESS;
    payload: AdjustmentWithDetails[];
}

export interface AdjustmentFetchMoreSuccessAction {
    type: typeof ADJUSTMENT_FETCH_MORE_SUCCESS;
    payload: AdjustmentWithDetails[];
}

export type AdjustmentActionTypes = 
    | AdjustmentAttemptAction
    | AdjustmentCreateSuccessAction
    | AdjustmentFailureAction
    | AdjustmentFetchSuccessAction
    | AdjustmentFetchMoreSuccessAction;

export const adjustmentAttemptAction = (): AdjustmentAttemptAction => ({
    type: ADJUSTMENT_ATTEMPT,
});

export const adjustmentCreateSuccessAction = (adjustment: AdjustmentWithDetails): AdjustmentCreateSuccessAction => ({
    type: ADJUSTMENT_CREATE_SUCCESS,
    payload: adjustment,
});

export const adjustmentFailureAction = (error: string): AdjustmentFailureAction => ({
    type: ADJUSTMENT_FAILURE,
    payload: error,
});

export const adjustmentFetchSuccessAction = (adjustments: AdjustmentWithDetails[]): AdjustmentFetchSuccessAction => ({
    type: ADJUSTMENT_FETCH_SUCCESS,
    payload: adjustments,
});

export const adjustmentFetchMoreSuccessAction = (adjustments: AdjustmentWithDetails[]): AdjustmentFetchMoreSuccessAction => ({
    type: ADJUSTMENT_FETCH_MORE_SUCCESS,
    payload: adjustments,
});
