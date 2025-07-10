import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import NotificationListDTO_Res  from '../interfaces/DTOs/res/NotificationListDTO_Res';
import CreateNotificationDTO_Req  from '../interfaces/DTOs/req/CreateNotificationDTO_Req';
import UnreadCountDTO_Res from '../interfaces/DTOs/res/UnreadCountDTO_Res';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'notification';

  constructor(private apiService: ApiServiceService) {}

  async createNotification(data: CreateNotificationDTO_Req): Promise<{ success: boolean, data?: { id: string }, error?: string }> {
    try {
      const result = await this.apiService.post<{ id: string }>(`${this.baseUrl}/create`, data);
      return {
        success: result.success,
        data: result.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Erro ao criar notificação.'
      };
    }
  }

  async listNotifications(): Promise<NotificationListDTO_Res[] | null> {
    try {
      return await this.apiService.get<NotificationListDTO_Res[]>(`${this.baseUrl}/list`);
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      return null;
    }
  }

  async countUnread(): Promise<number> {
    try {
      const result = await this.apiService.get<UnreadCountDTO_Res>(`${this.baseUrl}/unread-count`);
      return result?.count ?? 0;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const result = await this.apiService.put<null>(`${this.baseUrl}/mark-as-read/${notificationId}`, {});
      return result !== null;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const result = await this.apiService.put<null>(`${this.baseUrl}/mark-all-as-read`, {});
      return result !== null;
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      return false;
    }
  }
}
