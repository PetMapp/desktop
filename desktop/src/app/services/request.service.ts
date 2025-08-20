import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface PetRequest {
  id?: string;
  userId: string;
  petId: string;
  userPetId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  imageUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private baseUrl = `${environment.ApiBaseUrl}request`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  createRequest(data: Omit<PetRequest, 'id' | 'createdAt'>): Observable<PetRequest> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.post<PetRequest>(this.baseUrl, data, { headers });
      })
    );
  }

  createRequestFormData(form: FormData): Observable<PetRequest> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        // não setar Content-Type, o browser define o boundary automaticamente
        return this.http.post<PetRequest>(this.baseUrl, form, { headers });
      })
    );
  }

  getRequestsByUser(userId: string): Observable<PetRequest[]> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<PetRequest[]>(`${this.baseUrl}/user/${userId}`, { headers });
      })
    );
  }

  getRequestsForUserPet(userPetId: string): Observable<PetRequest[]> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<PetRequest[]>(`${this.baseUrl}/pet/${userPetId}`, { headers });
      })
    );
  }

  updateRequestStatus(requestId: string, status: 'pending' | 'accepted' | 'rejected'): Observable<PetRequest> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.put<PetRequest>(`${this.baseUrl}/${requestId}/status`, { status }, { headers });
      })
    );
  }

  countRequestsByStatus(userId: string, status: 'pending' | 'accepted' | 'rejected'): Observable<{ count: number }> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<{ count: number }>(`${this.baseUrl}/user/${userId}/count?status=${status}`, { headers });
      })
    );
  }
}