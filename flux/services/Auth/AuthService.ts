import { UserResponse } from "@flux/entities/User";
import { useFetch } from "hooks/http/secureFetch";

// constans
import { WheekConfig } from "config/config.wheek.breadriuss";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormData } from "shared/interfaces/FormUserData";

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

    async save(formData: FormData): Promise<{ data: UserResponse | null, error: string | null }> {
        if (!formData.username || !formData.lastName || !formData.firstName || !formData.password || !formData.email) {
            return { data: null, error: 'El correo electrónico es obligatorio! Intenta de nuevo.' };
        }

        if (formData.password !== formData.confirmPassword) {
            return { data: null, error: 'Las contraseñas no coinciden! Intenta de nuevo.' };
        }

        const { data, error } = await useFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/auth/save`,
                method: 'POST',
                body: {
                    email: formData.email.trim(),
                    password: formData.password.trim(),
                    name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    username: formData.username.trim()
                }
            }
        })
    
        if (error) {
            return { data: null, error: error };
        }
        
        await AsyncStorage.setItem('token', data.access_token);
        await AsyncStorage.setItem('tokenr', data.refresh_token);
        return { data, error: null };
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
        
        console.log(`Datos de la verificación de jwt: ${JSON.stringify(data)}`)
        return { data: data.value, error: null};
    },

    async updateProfile(userData: { name: string, email: string }): Promise<{ data: UserResponse | null, error: string | null }> {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            return { data: null, error: 'No authentication token found.' };
        }

        const { data, error } = await useFetch({
            options: {
                url: `${WheekConfig.API_BASE_URL}/user/update`, // Assuming this endpoint
                method: 'PUT', // Or PATCH, depending on API design
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: userData,
            }
        });

        if (error) {
            return { data: null, error: error };
        }

        return { data, error: null };
    }
}
