export interface GroupMember {
  id: number;
  user_id: number;
  status: string; // TODO enum
  nickname: string;
}