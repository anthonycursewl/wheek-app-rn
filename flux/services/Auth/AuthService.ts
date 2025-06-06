import { UserResponse } from "@/flux/entities/User";
import { useFetch } from "@/hooks/http/secureFetch";

// constans
import { WheekConfig } from "@/config/config.wheek.breadriuss";

export const AuthService = {
    async login(email: string, password: string, ref: 'email' | 'password'): Promise<{ data: UserResponse | null, error: string | null }> {
        const { data, error } = await useFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/auth/login?ref=${ref}`,
                method: 'POST',
                body: {
                    email,
                    password
                }
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
    
        return { data, error: null};
    }   
}