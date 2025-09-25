import { create } from "zustand";
import { MemberActions } from "../Actions/MemberActions";
import { MemberService } from "../services/Members/MemberService";

interface MemberStore {
    loading: boolean;
    error: string | null;
    members: any[];
    skip: number;
    take: number;
    hasMore: boolean;
    
    // actions
    _memberAttempt: () => void;
    _memberSuccess: (member: any) => void;
    _memberFailure: (error: string) => void;
    _getAllMembersAttempt: () => void;
    _getAllMembersSuccess: (members: any[], isNewPage?: boolean) => void;
    _getAllMembersFailure: (error: string) => void;
    _updateMemberSuccess: (member: any) => void;
    _deleteMemberSuccess: (member: any) => void;
    _loadMoreMembersSuccess: (members: any[]) => void;
    resetPagination: () => void;

    // dispatcher
    dispatch: (action: { type: string; payload?: any }) => void;
    
    // selected member
    selectedMember: any | null;
    setSelectedMember: (member: any | null) => void;

    // clear store
    clearStore: () => void;
}

export const useMemberStore = create<MemberStore>((set, get) => ({
    loading: false,
    error: null,
    members: [],
    skip: 1,
    take: 10,
    hasMore: true,
    selectedMember: null,
    setSelectedMember: (member: any | null) => {
        set({
            selectedMember: member
        })
    },

    _memberAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _memberSuccess: (member: any) => {
        set({
            loading: false,
            error: null,
            members: [member, ...get().members]
        })
    },

    _memberFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _getAllMembersAttempt: () => {
        set({
            loading: true,
            error: null
        })
    },

    _getAllMembersSuccess: (newMembers: any[]) => {
        const currentState = get();
        set({
            loading: false,
            error: null,
            members: newMembers,
            skip: currentState.members.length,
            hasMore: newMembers.length >= currentState.take
        })
    },

    _loadMoreMembersSuccess: (newMembers: any[]) => {
        const currentState = get();
        const updatedMembers = [...currentState.members, ...newMembers];
        set({
            loading: false,
            error: null,
            members: updatedMembers,
            skip: currentState.members.length,
            hasMore: newMembers.length >= currentState.take
        })
    },

    _getAllMembersFailure: (error: string) => {
        set({
            loading: false,
            error: error,
        })
    },

    _updateMemberSuccess: (member: any) => {
        const currentState = get();
        const updatedMembers = currentState.members.map(m => 
            m.id === member.id ? member : m
        );
        set({
            loading: false,
            error: null,
            members: updatedMembers
        })
    },

    _deleteMemberSuccess: (member: any) => {
        const currentState = get();
        const updatedMembers = currentState.members.filter(m => m.id !== member.id);
        set({
            loading: false,
            error: null,
            members: updatedMembers
        })
    },

    resetPagination: () => {
        set({
            skip: 1,
            take: 10,
            hasMore: true,
            members: []
        })
    },

    clearStore: () => {
        set({
            loading: false,
            error: null,
            members: [],
            skip: 1,
            take: 10,
            hasMore: true,
            selectedMember: null
        })
    },

    dispatch: async (action) => {
        const currentState = get();
        
        switch (action.type) {
            case MemberActions.MEMBER_ATTEMPT:
                currentState._memberAttempt();
                break;

            case MemberActions.MEMBER_SUCCESS:
                currentState._memberSuccess(action.payload.response);
                break;

            case MemberActions.MEMBER_FAILURE:
                currentState._memberFailure(action.payload.error);
                break;

            case MemberActions.GET_ALL_MEMBERS_ATTEMPT:
                currentState._getAllMembersAttempt();
                break;

            case MemberActions.GET_ALL_MEMBERS_SUCCESS:
                currentState._getAllMembersSuccess(action.payload.response);
                break;

            case MemberActions.LOAD_MORE_MEMBERS_SUCCESS:
                currentState._loadMoreMembersSuccess(action.payload.response);
                break;

            case MemberActions.GET_ALL_MEMBERS_FAILURE:
                currentState._getAllMembersFailure(action.payload.error);
                break;

            case MemberActions.UPDATE_MEMBER_SUCCESS:
                currentState._updateMemberSuccess(action.payload.response);
                break;

            case MemberActions.DELETE_MEMBER_SUCCESS:
                currentState._deleteMemberSuccess(action.payload.response);
                break;

            default:
                break;
        }
    }
}));
