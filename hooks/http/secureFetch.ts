import { FetchProps } from "./interfaces/FetchProps";

export const useFetch = async ({ options }: FetchProps): Promise<{ data: any | null, error: string | null }> => {
    const { url, method = 'GET', headers, body, stringify = true } = options;
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
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