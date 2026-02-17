import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { Season } from '@/pages/predictions/models/season.dto';

export interface Group {
  id: number;
  name: string;
  isOwner: boolean;
  createdAt: string;
  tournament: Competition;
  season: Season;
  inviteCode: string;
  members: GroupMember[];
}
