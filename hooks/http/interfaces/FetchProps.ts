import { MethodsAllowed } from "./MethodsAllowed";

export interface FetchProps {
    options: {
        url: string;
        method?: MethodsAllowed;
        headers?: Record<string, string>;
        body?: any;
        stringify?: boolean,
        disableContentType?: boolean
    }
}