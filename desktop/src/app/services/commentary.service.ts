import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CreateCommentaryDTO_Req } from '../interfaces/DTOs/res/CreateCommentaryDTO_Req';
import { CommentaryListDTO_Res } from '../interfaces/DTOs/res/CommentaryListDTO_Res';
import { CommentaryDeleteDTO_Req } from '../interfaces/DTOs/req/CommentaryDeleteDTO_Req';
import { CommentaryEditDTO_Req } from '../interfaces/DTOs/req/CommentaryEditDTO_Req';

interface ApiResponse<T> {
  data: T;
  errorMessage: string | null;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommentaryService {
  private baseUrl = 'http://localhost:3000/api/commentary';

  constructor(private http: HttpClient) {}

  createComment(data: CreateCommentaryDTO_Req): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/create`, data);
  }

  listComments(petId: string): Observable<ApiResponse<CommentaryListDTO_Res[]>> {
    return this.http.get<ApiResponse<CommentaryListDTO_Res[]>>(`${this.baseUrl}/list/${petId}`);
  }

  editComment(data: CommentaryEditDTO_Req): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/edit`, data);
  }

  removeComment(data: CommentaryDeleteDTO_Req): Observable<ApiResponse<null>> {
    return this.http.request<ApiResponse<null>>('delete', `${this.baseUrl}/remove`, { body: data });
  }
}
