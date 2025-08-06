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

    const statusSub = this.wsService.connectionStatus$.subscribe(status => {
      this.isConnected = status;
      console.log('Status da conexão WebSocket:', status);
    });
    this.subscriptions.push(statusSub);

    const messagesSub = this.wsService.messages$.subscribe(msg => {
      console.log('Mensagem recebida:', msg);
      
      if ((msg.from === this.currentUserId && msg.to === this.userId) || 
          (msg.from === this.userId && msg.to === this.currentUserId)) {
        const normalizedMsg = this.normalizeMessage(msg);
        
        const exists = this.messages.some(existingMsg => 
          existingMsg.text === normalizedMsg.text && 
          existingMsg.userId === normalizedMsg.userId &&
          Math.abs(new Date(existingMsg.createdAt!).getTime() - new Date(normalizedMsg.createdAt!).getTime()) < 2000
        );
        
        if (!exists) {
          this.messages.push(normalizedMsg);
          this.sortMessages();
          console.log('Nova mensagem adicionada via WebSocket');
        }
      }
    });
    this.subscriptions.push(messagesSub);

    this.wsService.connect(this.currentUserId);
  }

  private normalizeMessage(msg: any): Message {
    return {
      id: msg.id || Date.now().toString() + Math.random(),
      userId: msg.userId || msg.from || msg.senderId,
      text: msg.text || msg.content || '',
      createdAt: msg.createdAt || msg.sentAt || new Date(),
      from: msg.from,
      to: msg.to
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
    
    this.wsService.disconnect();
  }

  onBackClick() {
    this.backToList.emit();
  }

  sendMessage(): void {
    if (this.messageText.trim() === '' || !this.userId || !this.currentUserId) {
      console.warn('Não é possível enviar mensagem: dados insuficientes');
      return;
    }

    if (!this.wsService.isConnected()) {
      console.warn('WebSocket não está conectado');
      return;
    }

    const messageData = {
      to: this.userId,
      content: this.messageText,
      sentAt: new Date(),
    };

    const immediateMsg: Message = {
      id: 'temp-' + Date.now(),
      userId: this.currentUserId,
      text: this.messageText,
      createdAt: new Date()
    };
    this.messages.push(immediateMsg);
    this.sortMessages();

    const messageText = this.messageText;
    this.messageText = '';

    this.wsService.sendMessage({
      ...messageData,
      from: this.currentUserId
    });

    this.messageService.sendMessage({
      receiverId: this.userId,
      text: messageText
    }).subscribe({
      next: (res) => {
        if (!res.success) {
          console.error('Erro ao salvar a mensagem:', res.errorMessage);
          this.removeMessageById(immediateMsg.id!);
        } else {
          console.log('Mensagem salva com sucesso no banco de dados');
        }
      },
      error: (err) => {
        console.error('Erro ao enviar a mensagem:', err);
        this.removeMessageById(immediateMsg.id!);
      }
    });
  }

  private removeMessageById(id: string): void {
    const index = this.messages.findIndex(m => m.id === id);
    if (index > -1) {
      this.messages.splice(index, 1);
    }
  }
}