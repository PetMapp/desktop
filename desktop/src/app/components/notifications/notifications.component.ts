import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import NotificationListDTO_Res from '../../interfaces/DTOs/res/NotificationListDTO_Res';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent
} from '@spartan-ng/ui-menu-helm';
import { IconComponent } from '../icon-component/icon-component.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    BrnMenuTriggerDirective,
    ButtonIconComponent,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    HlmSubMenuComponent,
    IconComponent
  ]
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationListDTO_Res[] = [];
  loading = false;

  constructor(private notificationService: NotificationService) { }

  async ngOnInit() {
    await this.loadNotifications();
  }

  async loadNotifications() {
    this.loading = true;
    const data = await this.notificationService.listNotifications();
    this.notifications = data || [];
    this.loading = false;
  }

  async markAllAsRead() {
    const success = await this.notificationService.markAllAsRead();
    if (success) {
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    }
  }

  public getTimeSinceCreation(dateString: string): string {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return `agora mesmo`;
  }

  get hasUnread(): boolean {
    return this.notifications.some(n => !n.read);
  }
}