export interface GroupMember {
  id: number;
  user_id: number;
  status?: string; // TODO enum
  nickname: string;
}

export enum GroupMemberStatus {
  Unverified = 'unverified',
  Verified = 'verified',
  Rejected = 'rejected',
  Left = 'left',
}
