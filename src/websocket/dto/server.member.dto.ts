export class serverMemberDto {
  user_Id: number;
  server_Id: number;
  joinedAt: string;
  user: { 
    nickname: string;
    createdAt: string;
  }
}
