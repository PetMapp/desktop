export interface CreateCommentaryDTO_Req {
  text: string;
  petId: string;
  parentId?: string | null;
}