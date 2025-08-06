import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  private currentUserId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: any = null;
  private isManualDisconnect = false;

  public messages$ = this.messageSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  connect(userId: string): void {
    if (this.socket && this.currentUserId === userId && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket já conectado para este usuário');
      return;
    }

    this.forceDisconnect();

    this.currentUserId = userId;
    this.isManualDisconnect = false;
    this.reconnectAttempts = 0;

    this.connectToServer(userId);
  }

  private connectToServer(userId: string): void {
    const url = `${environment.wsUrl}?userId=${userId}`;
    
    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket conectado para usuário:', userId);
        this.connectionStatusSubject.next(true);
        this.reconnectAttempts = 0;
        this.clearReconnectTimer();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Mensagem recebida via WebSocket:', data);
          this.messageSubject.next(data);
        } catch (error) {
          console.error('Erro ao parsear mensagem WebSocket:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        this.connectionStatusSubject.next(false);
        this.socket = null;

        if (!this.isManualDisconnect && this.currentUserId) {
          this.handleReconnection();
        }
      };

      this.socket.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        this.connectionStatusSubject.next(false);
      };

    } catch (error) {
      console.error('Erro ao criar WebSocket:', error);
      this.handleReconnection();
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Máximo de tentativas de reconexão atingido');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${this.reconnectInterval/1000}s`);

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      if (this.currentUserId && !this.isManualDisconnect) {
        this.connectToServer(this.currentUserId);
      }
    }, this.reconnectInterval);

    this.reconnectInterval = Math.min(this.reconnectInterval * 1.5, 30000); // máximo 30s
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  sendMessage(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
        console.log('Mensagem enviada via WebSocket:', message);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    } else {
      console.warn('WebSocket não está conectado. Estado atual:', this.socket?.readyState);
    }
  }

  disconnect(): void {
    console.log('Desconectando WebSocket manualmente');
    this.isManualDisconnect = true;
    this.forceDisconnect();
  }

  private forceDisconnect(): void {
    this.clearReconnectTimer();
    
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close(1000, 'Desconexão manual');
      }
      this.socket = null;
    }
    
    this.connectionStatusSubject.next(false);
    this.currentUserId = null;
    this.reconnectAttempts = 0;
    this.reconnectInterval = 3000;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}