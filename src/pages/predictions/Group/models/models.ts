import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import { Season } from '@/pages/predictions/models/season.dto';

export interface GroupDto {
  id: number;
  name: string;
  tournament: Competition;
  season: Season;
  members: GroupMember[];
}

export interface GroupData {
  group: GroupDto;
  matches: MatchDto[];
  predictions: PredictionDto[];
}

export interface PredictionTable {
  // key- user_id
  [key: number]: {
    // key- match_id, value - prediction index in array
    [key: number]: number | null;
  };
}

export interface TEditPrediction {
  groupId: number;
  match: MatchDto;
  prediction: PredictionDto | null;
}
