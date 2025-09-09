import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface PetRequest {
  id: string;
  userId: string;
  petId: string;
  userPetId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  fromUser?: {
    displayName: string;
    photoURL: string;
  };
  petOwner?: {
    displayName: string;
    photoURL: string;
  };
  pet?: {
    apelido?: string;
    petImage?: string | null;
  };
  proofImageUrl?: string;
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
        return this.http.post<PetRequest>(this.baseUrl, form, { headers });
      })
    );
  }

  getRequestsByUser(userId: string): Observable<ApiResponse<PetRequest[]>> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<ApiResponse<PetRequest[]>>(`${this.baseUrl}/user/${userId}`, { headers });
      })
    );
  }

  getRequestsForUserPet(userPetId: string): Observable<ApiResponse<PetRequest[]>> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<ApiResponse<PetRequest[]>>(`${this.baseUrl}/pet/${userPetId}`, { headers });
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

  getUserRequestForPet(userId: string, petId: string): Observable<{ data: { exists: boolean; status?: 'pending' | 'accepted' | 'rejected' } }> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<{ data: { exists: boolean; status?: 'pending' | 'accepted' | 'rejected' } }>(`${this.baseUrl}/user/${userId}/${petId}`, { headers });
      })
    );
  }

  checkIfUserRequestWasAccepted(userId: string, petId: string): Observable<{ data: boolean }> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<{ data: boolean }>(`${this.baseUrl}/user/${userId}/${petId}/accepted`, { headers });
      })
    );
  }

  getRequestStatus(requestId: string): Observable<{ data: 'pending' | 'accepted' | 'rejected' | null }> {
    return this.auth.getUserToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<{ data: 'pending' | 'accepted' | 'rejected' | null }>(`${this.baseUrl}/${requestId}/status`, { headers });
      })
    );
  }
}