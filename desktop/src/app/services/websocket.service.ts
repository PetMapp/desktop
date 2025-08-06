import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();
  public messages$ = this.messageSubject.asObservable();

  connect(userId: string): void {
    if (this.socket) return;

    const url = `${environment.wsUrl}?userId=${userId}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log('WebSocket conectado');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensagem recebida via WebSocket:', data);
      this.messageSubject.next(data);
    };
    this.socket.onclose = () => {
      console.log('WebSocket desconectado');
      this.socket = null;
    };
    this.socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };
  }

  sendMessage(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket não está conectado');
    }
  }

  disconnect(): void {
    this.socket?.close();
  }
}
