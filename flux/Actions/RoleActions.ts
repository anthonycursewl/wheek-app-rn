import { RoleWithPermissions } from "@flux/entities/Role";
import { Role } from "@flux/entities/Role";

export enum RoleActions {
    ROLE_ATTEMPT = 'ROLE_ATTEMPT',    
    ROLE_FAILURE = 'ROLE_FAILURE',
    ROLE_SUCCESS_ALL = 'ROLE_SUCCESS_ALL',
    ROLE_SUCCESS_CREATE = 'ROLE_SUCCESS_CREATE',
    ROLE_SUCCESS_GET = 'ROLE_SUCCESS_GET',
}

export const roleAttemptAction = () => ({
  type: RoleActions.ROLE_ATTEMPT,
});

export const roleFailureAction = (error: string) => ({
    type: RoleActions.ROLE_FAILURE,
    payload: { error },
});

export const roleSuccessAllAction = (response: Role[], isRefreshing: boolean) => ({
  type: RoleActions.ROLE_SUCCESS_ALL,
  payload: { response, isRefreshing },
});

export const roleSuccessCreateAction = (response: Role) => ({
  type: RoleActions.ROLE_SUCCESS_CREATE,
  payload: { response },
});

export const roleSuccessGetAction = (response: RoleWithPermissions) => ({
    type: RoleActions.ROLE_SUCCESS_GET,
    payload: { response },
});


    