import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { CreateMessageDTO_Req } from '../interfaces/DTOs/req/CreateMessageDTO_Req';

export interface ApiResponse<T> {
  data: T;
  errorMessage: string | null;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = `${environment.ApiBaseUrl}message`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  sendMessage(message: CreateMessageDTO_Req): Observable<ApiResponse<string>> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.post<ApiResponse<string>>(`${this.baseUrl}/send`, message, { headers });
      })
    );
  }

  getMessagesBetweenUsers(otherUserId: string): Observable<ApiResponse<any[]>> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/between/${otherUserId}`, { headers });
      })
    );
  }

  getUsersWithMessages(): Observable<ApiResponse<any[]>> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/users`, { headers });
      })
    );
  }

  markAllAsReadBetweenUsers(currentUserId: string, otherUserId: string): Observable<ApiResponse<void>> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        const body = {
          userA: currentUserId,
          userB: otherUserId,
          currentUserId
        };

        return this.http.put<ApiResponse<void>>(`${this.baseUrl}/read/all`, body, { headers });
      })
    );
  }
}
