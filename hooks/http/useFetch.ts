import AsyncStorage from "@react-native-async-storage/async-storage";
import { FetchProps } from "./interfaces/FetchProps";

export const secureFetch = async ({ options }: FetchProps): Promise<{ data: any | null, error: string | null }> => {
    const { url, method = 'GET', headers, body, stringify = true } = options;
    try {
        const token = await AsyncStorage.getItem('token')
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                'Authorization': `Bearer ${token}`
            },
            body: stringify ? JSON.stringify(body) : body
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await response.json();
        return { data: data, error: null }
    } catch (error: any) {
        console.log(error)
        return { error: error.message, data: null }   
    }
}