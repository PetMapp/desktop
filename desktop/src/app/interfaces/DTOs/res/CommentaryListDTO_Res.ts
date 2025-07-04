export interface CommentaryListDTO_Res {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user: {
    displayName: string;
    photoURL: string;
  };
  parentId?: string | null;
  repliedToName?: string | null;
}