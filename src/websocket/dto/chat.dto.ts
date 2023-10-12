export interface ChatDto {
  sender_Id: number;
  type?: string;
  channel_id: number;
  content: string;
}