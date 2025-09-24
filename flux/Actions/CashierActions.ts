export enum CashierActions {
    CASHIER_ATTEMPT = 'CASHIER_ATTEMPT',
    CASHIER_SUCCESS = 'CASHIER_SUCCESS',
    CASHIER_FAILURE = 'CASHIER_FAILURE',
    GET_ALL_CASHIERS_ATTEMPT = 'GET_ALL_CASHIERS_ATTEMPT',
    GET_ALL_CASHIERS_SUCCESS = 'GET_ALL_CASHIERS_SUCCESS',
    GET_ALL_CASHIERS_FAILURE = 'GET_ALL_CASHIERS_FAILURE',
    UPDATE_CASHIER_SUCCESS = 'UPDATE_CASHIER_SUCCESS',
    DELETE_CASHIER_SUCCESS = 'DELETE_CASHIER_SUCCESS',
    LOAD_MORE_CASHIERS_SUCCESS = 'LOAD_MORE_CASHIERS_SUCCESS'
}

export const cashierAttemptAction = () => ({
    type: CashierActions.CASHIER_ATTEMPT,
});

export const cashierSuccessAction = (response: any) => ({
    type: CashierActions.CASHIER_SUCCESS,
    payload: { response },
});

export const cashierFailureAction = (error: string) => ({
    type: CashierActions.CASHIER_FAILURE,
    payload: { error },
});

export const getAllCashiersAttemptAction = () => ({
    type: CashierActions.GET_ALL_CASHIERS_ATTEMPT
});

export const getAllCashiersSuccessAction = (response: any[]) => ({
    type: CashierActions.GET_ALL_CASHIERS_SUCCESS,
    payload: { response }
});

export const loadMoreCashiersSuccessAction = (response: any[]) => ({
    type: CashierActions.LOAD_MORE_CASHIERS_SUCCESS,
    payload: { response }
});

export const getAllCashiersFailureAction = (error: string) => ({
    type: CashierActions.GET_ALL_CASHIERS_FAILURE,
    payload: { error }
});

export const updateCashierSuccessAction = (response: any) => ({
    type: CashierActions.UPDATE_CASHIER_SUCCESS,
    payload: { response }
});

export const deleteCashierSuccessAction = (response: any) => ({
    type: CashierActions.DELETE_CASHIER_SUCCESS,
    payload: { response }
});
