export interface CreateMessageDTO_Req {
  receiverId: string;
  text: string;
  relatedCommentId?: string;
  relatedPetId?: string;
  replyToMessageId?: string;
}