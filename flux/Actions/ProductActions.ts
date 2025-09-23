import { Product } from "@flux/entities/Product";

export enum ProductActions {
    PRODUCT_CREATE_ATTEMPT = 'PRODUCT_CREATE_ATTEMPT',    
    PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS',
    PRODUCT_CREATE_FAILURE = 'PRODUCT_CREATE_FAILURE',
    PRODUCT_DELETE = 'PRODUCT_DELETE',
    PRODUCT_SEARCH_SUCCESS = 'PRODUCT_SEARCH_SUCCESS',
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

export const productDeleteAction = (product: Product) => ({
  type: ProductActions.PRODUCT_DELETE,
  payload: { product },
});

export const productSearchSuccessAction = () => ({
  type: ProductActions.PRODUCT_SEARCH_SUCCESS,
});


    