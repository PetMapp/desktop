import { Component, EventEmitter, Output, OnInit, OnDestroy, Input } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { IconComponent } from '../icon-component/icon-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

interface Message {
  userId?: string;
  from?: string;
  to?: string;
  text?: string;
  content?: string;
  createdAt?: Date;
  sentAt?: Date;
  id?: string;
  read: boolean;
}

@Component({
  selector: 'app-message-display',
  templateUrl: './message-display.component.html',
  styleUrl: './message-display.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent]
})
export class MessageDisplayComponent implements OnInit, OnDestroy {
  @Input() userId: string | null = null;
  @Output() backToList = new EventEmitter<void>();

  messages: Message[] = [];
  public currentUserId: string | null = null;
  messageText = '';
  userName: string = 'Usuário';
  userPhoto: string = '';
  isConnected = false;

  private subscriptions: Subscription[] = [];
  private viewingInterval: any;

  constructor(
    private wsService: WebSocketService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log('MessageDisplayComponent iniciado para userId:', this.userId);

    await new Promise<void>((resolve) => {
      const userSub = this.authService.getUserLogged().subscribe(user => {
        this.currentUserId = user?.uid ?? null;
        console.log('Usuário logado (currentUserId):', this.currentUserId);
        resolve();
      });
      this.subscriptions.push(userSub);
    });

    if (!this.userId || !this.currentUserId) {
      console.error('Dados insuficientes para inicializar o componente');
      return;
    }

    this.viewingInterval = setInterval(() => {
      if (this.wsService.isConnected() && this.userId) {
        this.wsService.sendMessage({ event: 'viewing', with: this.userId });
        console.log('Evento viewing reenviado periodicamente para:', this.userId);
      }
    }, 15000);

    await this.loadUserInfo();
    await this.loadMessages();
    this.setupWebSocketConnection();
  }

  private async loadUserInfo(): Promise<void> {
    try {
      const user = await this.authService.getUserById(this.userId!);
      this.userName = user?.displayName ?? 'Usuário';
      this.userPhoto = user?.photoURL ?? '';
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }
  }

  private async loadMessages(): Promise<void> {
    const messagesSub = this.messageService.getMessagesBetweenUsers(this.userId!).subscribe((res) => {
      if (res.success) {
        this.messages = res.data.map(this.normalizeMessage.bind(this));
        console.log('Mensagens carregadas do banco:', this.messages.length);
      }
    });
    this.subscriptions.push(messagesSub);
  }

  private setupWebSocketConnection(): void {
    if (!this.currentUserId) {
      console.error('Não é possível conectar ao WebSocket sem currentUserId');
      return;
    }

    const connectionStatusSubscription = this.wsService.connectionStatus$.subscribe(status => {
      this.isConnected = status;
      console.log('Status da conexão WebSocket:', status);

      if (status && this.userId && this.currentUserId) {
        try {
          const viewingPayload = {
            event: 'viewing',
            with: this.userId
          };
          this.wsService.sendMessage(viewingPayload);
          console.log('Evento viewing enviado para:', this.userId);
        } catch (err) {
          console.error('Erro ao enviar evento viewing:', err);
        }

        this.messages = this.messages.map(message => {
          if (message.userId === this.userId) return { ...message, read: true };
          return message;
        });
        this.sortMessages();
      }
    });
    this.subscriptions.push(connectionStatusSubscription);

    const messageFramesSubscription = this.wsService.messages$.subscribe(messageFrame => {
      console.log('Mensagem recebida via WS:', messageFrame);

      if (messageFrame.event === 'messagesRead') {
        const messagesReadPayload = messageFrame.data;
        const { userA, userB, readBy } = messagesReadPayload;

        if (
          (userA === this.currentUserId && userB === this.userId) ||
          (userB === this.currentUserId && userA === this.userId)
        ) {
          this.messages = this.messages.map(m => ({ ...m, read: true }));
          this.sortMessages();
          console.log('Mensagens marcadas como lidas via WS');
        }
        return;
      }

      const isMessageForCurrentConversation =
        (messageFrame.from === this.currentUserId && messageFrame.to === this.userId) ||
        (messageFrame.from === this.userId && messageFrame.to === this.currentUserId);

      if (isMessageForCurrentConversation) {
        const normalizedMessage = this.normalizeMessage(messageFrame);

        const alreadyExists = this.messages.some(existingMessage =>
          existingMessage.text === normalizedMessage.text &&
          existingMessage.userId === normalizedMessage.userId &&
          Math.abs(new Date(existingMessage.createdAt!).getTime() - new Date(normalizedMessage.createdAt!).getTime()) < 2000
        );

        if (!alreadyExists) {
          this.messages.push(normalizedMessage);
          this.sortMessages();
          console.log('Nova mensagem adicionada via WebSocket');
        }
        return;
      }
    });
    this.subscriptions.push(messageFramesSubscription);

    this.wsService.connect(this.currentUserId);
  }

  private sendViewingEvent(): void {
    try {
      this.wsService.sendMessage({
        event: 'viewing',
        with: this.userId
      });
      console.log('Evento viewing enviado para:', this.userId);

      this.messages = this.messages.map(message => {
        if (message.userId === this.userId) return { ...message, read: true };
        return message;
      });
      this.sortMessages();
    } catch (err) {
      console.error('Erro ao enviar evento viewing:', err);
    }
  }

  private normalizeMessage(msg: any): Message {
    return {
      id: msg.id || Date.now().toString() + Math.random(),
      userId: msg.userId || msg.from || msg.senderId,
      text: msg.text || msg.content || '',
      createdAt: msg.createdAt || msg.sentAt || new Date(),
      from: msg.from,
      to: msg.to,
      read: msg.read || false
    };
  }

  private sortMessages(): void {
    this.messages.sort((a, b) =>
      new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );
  }

  ngOnDestroy(): void {
    console.log('MessageDisplayComponent sendo destruído');

    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    this.wsService.sendMessage({
      event: 'viewing',
      with: null
    });
    this.wsService.disconnect();
  }

  onBackClick() {
    this.wsService.sendMessage({
      event: 'viewing',
      with: null
    });
    this.backToList.emit();
  }

  sendMessage(): void {
    if (this.messageText.trim() === '' || !this.userId || !this.currentUserId) return;

    if (!this.wsService.isConnected()) return;

    const messageText = this.messageText;
    this.messageText = '';

    const immediateMsg: Message = {
      id: 'temp-' + Date.now(),
      userId: this.currentUserId,
      text: messageText,
      createdAt: new Date(),
      read: false
    };
    this.messages.push(immediateMsg);
    this.sortMessages();

    this.wsService.sendMessage({
      event: 'sendMessage',
      from: this.currentUserId,
      to: this.userId,
      content: messageText,
      sentAt: new Date().toISOString()
    });
  }

  private removeMessageById(id: string): void {
    const index = this.messages.findIndex(m => m.id === id);
    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }
}