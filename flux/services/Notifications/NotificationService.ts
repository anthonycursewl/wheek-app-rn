import { secureFetch } from "hooks/http/useFetch";
import { WheekConfig } from "config/config.wheek.breadriuss";

export interface Notification {
    id: string;
    invited_by: {
        name: string;
        last_name: string;
    };
    store: {
        name: string;
    };
    role: {
        name: string;
    };
    token: string;
    status: string;
    created_at: Date;
    expires_at: Date;
}

export const NotificationService = {
    async getNotifications(email: string, take: number, skip: number): Promise<{ data: Notification[]; error: any; }> {
        const { data, error } = await secureFetch({
            options: {
                method: 'GET',
                url: `${WheekConfig.API_BASE_URL}/notifications/get/all/${email}?take=${take}&skip=${skip}`,
            }
        });
        
        if (error) return { data: [], error };
    
        return { data: data.value, error: null };
    },

    async acceptNotification(notificationId: string): Promise<{ data: Notification | null; error: any; }> {
        const { data, error } = await secureFetch({
            options: {
                method: 'POST',
                url: `${WheekConfig.API_BASE_URL}/notifications/accept/through/token`,
                body: {
                    notification_id: notificationId,
                }
            }
        });
        
        if (error) return { data: null, error };
        return { data: data.value, error: null };
    },

    async rejectNotification(notificationId: string): Promise<{ data: Notification | null; error: string | null; }> {
        const { data, error } = await secureFetch({
            options: {
                method: 'POST',
                url: `${WheekConfig.API_BASE_URL}/notifications/reject/through/token`,
                body: {
                    notification_id: notificationId,
                }
            }
        });
        
        if (error) return { data: null, error };
        return { data: data.value, error: null };
    }
};