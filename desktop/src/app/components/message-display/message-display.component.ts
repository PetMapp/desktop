import { Component, EventEmitter, Output, OnInit, OnDestroy, Input } from '@angular/core'; 
import { WebSocketService } from '../../services/websocket.service';
import { IconComponent } from '../icon-component/icon-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

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

  constructor(
    private wsService: WebSocketService,
    private messageService: MessageService,
    private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.authService.getUserLogged().subscribe(user => {
      this.currentUserId = user?.uid ?? null;
    });

    if (!this.userId) return;

    try {
      const user = await this.authService.getUserById(this.userId);
      this.userName = user?.displayName ?? 'Usuário';
      this.userPhoto = user?.photoURL ?? '';
    } catch (err) {
      console.error('Erro ao buscar usuário:', err);
    }

    // Primeiro carrega as mensagens do banco
    this.messageService.getMessagesBetweenUsers(this.userId).subscribe((res) => {
      if (res.success) {
        this.messages = res.data.map(this.normalizeMessage.bind(this));
      }
    });

    // Depois conecta ao WebSocket
    this.wsService.connect(this.userId);

    this.wsService.messages$.subscribe(msg => {
      if (msg.from === this.userId || msg.to === this.userId) {
        const normalizedMsg = this.normalizeMessage(msg);
        
        // Evita duplicatas verificando se já existe uma mensagem similar
        const exists = this.messages.some(existingMsg => 
          existingMsg.text === normalizedMsg.text && 
          existingMsg.userId === normalizedMsg.userId &&
          Math.abs(new Date(existingMsg.createdAt!).getTime() - new Date(normalizedMsg.createdAt!).getTime()) < 1000
        );
        
        if (!exists) {
          this.messages.push(normalizedMsg);
          // Ordena por data para manter ordem cronológica
          this.messages.sort((a, b) => 
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
          );
        }
      }
    });
  }

  // Normaliza a estrutura da mensagem para um formato padrão
  private normalizeMessage(msg: any): Message {
    return {
      id: msg.id || Date.now().toString(),
      userId: msg.userId || msg.from || msg.senderId,
      text: msg.text || msg.content || '',
      createdAt: msg.createdAt || msg.sentAt || new Date(),
      from: msg.from,
      to: msg.to
    };
  }

  ngOnDestroy(): void {
    this.wsService.disconnect();
  }

  onBackClick() {
    this.backToList.emit();
  }

  sendMessage(): void {
    if (this.messageText.trim() === '' || !this.userId || !this.currentUserId) return;

    const messageData = {
      to: this.userId,
      content: this.messageText,
      sentAt: new Date(),
    };

    const immediateMsg: Message = {
      userId: this.currentUserId,
      text: this.messageText,
      createdAt: new Date()
    };
    this.messages.push(immediateMsg);

    this.wsService.sendMessage({
      ...messageData,
      from: this.currentUserId
    });

    this.messageService.sendMessage({
      receiverId: this.userId,
      text: this.messageText
    }).subscribe({
      next: (res) => {
        if (!res.success) {
          console.error('Erro ao salvar a mensagem:', res.errorMessage);
          const index = this.messages.findIndex(m => m === immediateMsg);
          if (index > -1) {
            this.messages.splice(index, 1);
          }
        }
      },
      error: (err) => {
        console.error('Erro ao enviar a mensagem:', err);
        const index = this.messages.findIndex(m => m === immediateMsg);
        if (index > -1) {
          this.messages.splice(index, 1);
        }
      }
    });

    this.messageText = '';
  }
}