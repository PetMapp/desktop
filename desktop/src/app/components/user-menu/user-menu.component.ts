import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuSeparatorComponent,
} from '@spartan-ng/ui-menu-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { WebSocketService } from '../../services/websocket.service';
import { AuthService } from '../../services/auth.service';

import { NotificationsComponent } from '../notifications/notifications.component';
import { ButtonIconComponent } from '../iconButton/iconButton.component';
import { RequestComponentComponent } from '../request-component/request-component.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    HlmButtonDirective,
    CommonModule,
    NotificationsComponent,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuSeparatorComponent,
    ButtonIconComponent,
    RequestComponentComponent
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  @Input() userLogged!: User | null;
  unredMessagesCount: number = 0;
  private wsSubscription!: Subscription;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private wsService: WebSocketService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUserLogged().subscribe(user => {
      if (user?.uid) {
        this.wsService.connect(user.uid);

        this.loadUnreadMessagesCount();
      }
    });

    this.wsSubscription = this.wsService.messages$.subscribe((event) => {
      if (event.event === 'message' || event.event === 'messagesRead' || event.event === 'updateUserList') {
        this.loadUnreadMessagesCount();
      }
    });
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }

  private loadUnreadMessagesCount() {
    this.messageService.getUnreadMessagesCount().subscribe({
      next: (response) => {
        this.unredMessagesCount = response.data ?? 0;
      },
      error: (err) => {
        console.error('Erro ao buscar mensagens não lidas:', err);
        this.unredMessagesCount = 0;
      }
    });
  }

  async logout() {
    localStorage.clear();
    await this.router.navigate(['/login']);
  }
}
