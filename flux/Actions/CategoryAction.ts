import { Category } from "../entities/Category";

export enum CategoryActions {
    CATEGORY_ATTEMPT = 'CATEGORY_ATTEMPT',    
    CATEGORY_SUCCESS = 'CATEGORY_SUCCESS',
    CATEGORY_FAILURE = 'CATEGORY_FAILURE'
}

export const categoryAttemptAction = () => ({
  type: CategoryActions.CATEGORY_ATTEMPT,
});

export const categorySuccessAction = (response: Category) => ({
  type: CategoryActions.CATEGORY_SUCCESS,
  payload: { response },
});

export const categoryFailureAction = (error: string) => ({
  type: CategoryActions.CATEGORY_FAILURE,
  payload: { error },
});


    