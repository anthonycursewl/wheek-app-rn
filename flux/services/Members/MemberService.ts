import { WheekConfig } from "config/config.wheek.breadriuss";
import { secureFetch } from "hooks/http/useFetch";

export const MemberService = {
    async getAllMembers(store_id: string, skip: number, take: number, queryParams: string): Promise<{ data: any | null, error: string | null }> {
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/members/${store_id}/get/all?skip=${skip}&take=${take}&${queryParams}`,
                method: 'GET',
            }
        })
    
        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    async createMember(member: any): Promise<{ data: any | null, error: string | null }> {
        if (!member.user?.name || !member.user?.email || !member.store_id) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }
        
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/members/create`,
                method: 'POST',
                body: member
            }
        })
    
        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    async createInvitation(email: string, role_id: string, store_id: string, message: string): Promise<{ data: any | null, error: string | null }> {
        if (!email || !role_id || !store_id || !message) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }
        
        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/members/${store_id}/create/invitation`,
                method: 'POST',
                body: { email, role_id, message }
            }
        })
    
        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    async updateMember(member: any, store_id: string): Promise<{ data: any | null, error: string | null }> {
        if (!member.user?.name || !member.user?.email || !member.store_id || !member.id) {
            return { data: null, error: 'Todos los campos son obligatorios! Intenta de nuevo.' };
        }

        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/members/update/${member.id}?store_id=${store_id}`,
                method: 'PUT',
                body: member,
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    },

    async deleteMember(member_id: string, store_id: string): Promise<{ data: any | null, error: string | null }> {
        if (!member_id) return { data: null, error: 'El id del miembro es obligatorio! Intenta de nuevo.' }

        const { data, error } = await secureFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/members/delete/${member_id}?store_id=${store_id}`,
                method: 'DELETE',
                disableContentType: true,
            }
        })

        if (error) return { data: null, error: error };
        return { data: data.value, error: null };
    }
}
