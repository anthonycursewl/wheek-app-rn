import { UserResponse } from "@/flux/entities/User";
import { useFetch } from "@/hooks/http/secureFetch";

// constans
import { WheekConfig } from "@/config/config.wheek.breadriuss";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
    async login(email: string, password: string, ref: 'email' | 'password'): Promise<{ data: UserResponse | null, error: string | null }> {
        if (!email) {
            return { data: null, error: 'El correo electrónico es obligatorio! Intenta de nuevo.' };
        }
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
        
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('tokenr', data.refresh_token);
        return { data, error: null};
    },
    
    async verifyToken(token: string): Promise<{ data: any | null, error: string | null }> {
        const { data, error } = await useFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/user/verify`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
    
        return { data, error: null};
    }
}