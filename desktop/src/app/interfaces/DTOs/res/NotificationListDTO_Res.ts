export default interface NotificationListDTO_Res {
    id: string;
    userId: string;
    type: "reply" | "report_sent" | "report_actioned" | "animal_wanted" | "animal_found" | "comment_reply";
    relatedCommentId?: string;
    relatedPetId?: string;
    fromUser?: {
        displayName: string;
        photoURL: string | null;
    };
    statusMessage?: string;
    read: boolean;
    createdAt: string;
}