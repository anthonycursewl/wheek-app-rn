import { create } from 'zustand';
import { AdjustmentActionTypes } from '@flux/Actions/AdjustmentActions';
import { AdjustmentWithDetails } from '@flux/entities/Adjustment';
import { set } from 'date-fns';

interface AdjustmentState {
    adjustments: AdjustmentWithDetails[];
    loading: boolean;
    error: string | null;
    dispatch: (action: AdjustmentActionTypes) => void;
    take: number;
    skip: number;
    hasMore: boolean;
    clearStore: () => void;
}

const baseState = {
    adjustments: [],
    loading: false,
    error: null,
    take: 10,
    skip: 0,
    hasMore: true,
};

const initialState: Omit<AdjustmentState, 'dispatch' | 'clearStore'> = {
    ...baseState
};


export const useAdjustmentStore = create<AdjustmentState>((set) => ({
    ...initialState,
    clearStore: () => { set(initialState) },
    dispatch: (action) => {
        switch (action.type) {
            case 'ADJUSTMENT_ATTEMPT':
                set({ loading: true, error: null });
                break;
            case 'ADJUSTMENT_CREATE_SUCCESS':
                set((state) => ({
                    adjustments: [action.payload, ...state.adjustments],
                    loading: false,
                    error: null,
                }));
                break;
            case 'ADJUSTMENT_FETCH_SUCCESS':
                set({
                    adjustments: action.payload,
                    loading: false,
                    error: null,
                    skip: action.payload.length,
                    hasMore: action.payload.length >= initialState.take,
                });
                break;
            case 'ADJUSTMENT_FETCH_MORE_SUCCESS':
                set((state) => ({
                    adjustments: [...state.adjustments, ...action.payload],
                    loading: false,
                    error: null,
                    skip: state.skip + action.payload.length,
                    hasMore: action.payload.length >= initialState.take,
                }));
                break;
            case 'ADJUSTMENT_FAILURE':
                set({
                    loading: false,
                    error: action.payload,
                });
                break;
        }
    },
}));
