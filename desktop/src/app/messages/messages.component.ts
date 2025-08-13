import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { AlternativeHeaderComponent } from '../components/alternative-header/alternative-header.component';
import { IconComponent } from '../components/icon-component/icon-component.component';
import { MobileFooterComponent } from '../components/mobile-footer/mobile-footer.component';
import { MessageDisplayComponent } from '../components/message-display/message-display.component';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/websocket.service';

import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/brain/dialog';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/helm/dialog';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderComponent,
    AlternativeHeaderComponent,
    IconComponent,
    MobileFooterComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    MessageDisplayComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  showChatOnMobile = false;
  userId: string | null = null;
  usersWithMessages: any[] = [];
  public currentUserId: string | null = null;
  private userSubscription?: Subscription;
  private wsSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private websocketService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.showChatOnMobile = !!this.userId;
    this.loadUsersWithMessages();

    this.userSubscription = this.authService.getUserLogged().subscribe(user => {
      this.currentUserId = user?.uid ?? null;

      if (this.currentUserId) {
        this.websocketService.connect(this.currentUserId);

        if (!this.wsSubscription) {
          this.wsSubscription = this.websocketService.messages$.subscribe(event => {
            if (event.event === 'updateUserList') {
              this.loadUsersWithMessages();
            }
          });
        }
      }
    });

    this.wsSubscription = this.websocketService.messages$.subscribe(event => {
      if (event.event === 'updateUserList') {
        this.loadUsersWithMessages();
      }
    });
  }

  toggleMobileView() {
    this.showChatOnMobile = !this.showChatOnMobile;
  }

  loadUsersWithMessages() {
    this.messageService.getUsersWithMessages().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.usersWithMessages = res.data;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar usuários com mensagens:', err);
      }
    });
  }

  selectUser(id: string) {
    this.userId = id;
    this.router.navigate(['/messages', id]);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
