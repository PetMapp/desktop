import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { CreateCommentaryDTO_Req } from '../interfaces/DTOs/res/CreateCommentaryDTO_Req';
import { CommentaryListDTO_Res } from '../interfaces/DTOs/res/CommentaryListDTO_Res';
import { CommentaryDeleteDTO_Req } from '../interfaces/DTOs/req/CommentaryDeleteDTO_Req';
import { CommentaryEditDTO_Req } from '../interfaces/DTOs/req/CommentaryEditDTO_Req';

@Injectable({
  providedIn: 'root'
})
export class CommentaryService {
  private baseUrl = 'commentary';

  constructor(private apiService: ApiServiceService) { }

  async createComment(data: CreateCommentaryDTO_Req): Promise<{ success: boolean, error?: string, data?: { id: string } }> {
    try {
      const result = await this.apiService.post<{ id: string }>(`${this.baseUrl}/create`, data);
      return {
        success: result.success,
        data: result.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Erro desconhecido'
      };
    }
  }

  async listComments(petId: string): Promise<CommentaryListDTO_Res[] | null> {
    return await this.apiService.get<CommentaryListDTO_Res[]>(`${this.baseUrl}/list/${petId}`);
  }

  async getReplies(commentId: string): Promise<CommentaryListDTO_Res[] | null> {
    return await this.apiService.get<CommentaryListDTO_Res[]>(`${this.baseUrl}/replies/${commentId}`);
  }

  async countReplies(commentId: string): Promise<number> {
    const count = await this.apiService.get<number>(`${this.baseUrl}/count-replies/${commentId}`);
    return count ?? 0;
  }

  async editComment(data: CommentaryEditDTO_Req): Promise<boolean> {
    const result = await this.apiService.put<null>(`${this.baseUrl}/edit`, data);
    return result !== null;
  }

  async removeComment(data: CommentaryDeleteDTO_Req): Promise<boolean> {
    const result = await this.apiService.delete<null>(`${this.baseUrl}/remove`, data);
    return result !== null;
  }

  async getCommentById(id: string): Promise<CommentaryListDTO_Res | null> {
    try {
      return await this.apiService.get<CommentaryListDTO_Res>(`/commentary/${id}`, true);
    } catch (err) {
      console.error('Erro ao buscar comentário por ID:', err);
      return null;
    }
  }
}
