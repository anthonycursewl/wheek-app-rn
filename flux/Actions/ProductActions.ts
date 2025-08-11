import { Product } from "@flux/entities/Product";

export enum ProductActions {
    PRODUCT_CREATE_ATTEMPT = 'PRODUCT_CREATE_ATTEMPT',    
    PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS',
    PRODUCT_CREATE_FAILURE = 'PRODUCT_CREATE_FAILURE',
}

export const productCreateAttemptAction = () => ({
  type: ProductActions.PRODUCT_CREATE_ATTEMPT,
});

export const productCreateSuccessAction = (response: Product) => ({
  type: ProductActions.PRODUCT_CREATE_SUCCESS,
  payload: { response },
});

export const productCreateFailureAction = (error: string) => ({
  type: ProductActions.PRODUCT_CREATE_FAILURE,
  payload: { error },
});


    