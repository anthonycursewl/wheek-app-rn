import { Category } from "../entities/Category";

export enum CategoryActions {
    CATEGORY_ATTEMPT = 'CATEGORY_ATTEMPT',    
    CATEGORY_SUCCESS = 'CATEGORY_SUCCESS',
    CATEGORY_FAILURE = 'CATEGORY_FAILURE',
    CATEGORY_SUCCESS_UPDATE = 'CATEGORY_SUCCESS_UPDATE',
    CATEGORY_SUCCESS_DELETE = 'CATEGORY_SUCCESS_DELETE',
    CATEGORY_REFRESH_SUCCESS = 'CATEGORY_REFRESH_SUCCESS',
    CATEGORY_LOAD_MORE_SUCCESS = 'CATEGORY_LOAD_MORE_SUCCESS'
}

export const categoryAttemptAction = () => ({
  type: CategoryActions.CATEGORY_ATTEMPT,
});


export const categoryFailureAction = (error: string) => ({
  type: CategoryActions.CATEGORY_FAILURE,
  payload: { error },
});

export const categorySuccessAction = (response: Category) => ({
  type: CategoryActions.CATEGORY_SUCCESS,
  payload: { response },
});

export const categorySuccessUpdateAction = (response: Category) => ({
  type: CategoryActions.CATEGORY_SUCCESS_UPDATE,
  payload: { response },
});

export const categorySuccessDeleteAction = (response: Category) => ({
  type: CategoryActions.CATEGORY_SUCCESS_DELETE,
  payload: { response },
});

export const categoryRefreshSuccessAction = (response: Category[]) => ({
  type: CategoryActions.CATEGORY_REFRESH_SUCCESS,
  payload: { response }
});

export const categoryLoadMoreSuccessAction = (response: Category[]) => ({
  type: CategoryActions.CATEGORY_LOAD_MORE_SUCCESS,
  payload: { response }
});



    