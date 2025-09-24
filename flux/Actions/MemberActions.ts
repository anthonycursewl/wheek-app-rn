export enum MemberActions {
    MEMBER_ATTEMPT = 'MEMBER_ATTEMPT',
    MEMBER_SUCCESS = 'MEMBER_SUCCESS',
    MEMBER_FAILURE = 'MEMBER_FAILURE',
    GET_ALL_MEMBERS_ATTEMPT = 'GET_ALL_MEMBERS_ATTEMPT',
    GET_ALL_MEMBERS_SUCCESS = 'GET_ALL_MEMBERS_SUCCESS',
    GET_ALL_MEMBERS_FAILURE = 'GET_ALL_MEMBERS_FAILURE',
    UPDATE_MEMBER_SUCCESS = 'UPDATE_MEMBER_SUCCESS',
    DELETE_MEMBER_SUCCESS = 'DELETE_MEMBER_SUCCESS',
    LOAD_MORE_MEMBERS_SUCCESS = 'LOAD_MORE_MEMBERS_SUCCESS'
}

export const memberAttemptAction = () => ({
    type: MemberActions.MEMBER_ATTEMPT,
});

export const memberSuccessAction = (response: any) => ({
    type: MemberActions.MEMBER_SUCCESS,
    payload: { response },
});

export const memberFailureAction = (error: string) => ({
    type: MemberActions.MEMBER_FAILURE,
    payload: { error },
});

export const getAllMembersAttemptAction = () => ({
    type: MemberActions.GET_ALL_MEMBERS_ATTEMPT
});

export const getAllMembersSuccessAction = (response: any[]) => ({
    type: MemberActions.GET_ALL_MEMBERS_SUCCESS,
    payload: { response }
});

export const loadMoreMembersSuccessAction = (response: any[]) => ({
    type: MemberActions.LOAD_MORE_MEMBERS_SUCCESS,
    payload: { response }
});

export const getAllMembersFailureAction = (error: string) => ({
    type: MemberActions.GET_ALL_MEMBERS_FAILURE,
    payload: { error }
});

export const updateMemberSuccessAction = (response: any) => ({
    type: MemberActions.UPDATE_MEMBER_SUCCESS,
    payload: { response }
});

export const deleteMemberSuccessAction = (response: any) => ({
    type: MemberActions.DELETE_MEMBER_SUCCESS,
    payload: { response }
});
