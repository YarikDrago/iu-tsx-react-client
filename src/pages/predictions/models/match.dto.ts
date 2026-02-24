import { Competition } from '@/pages/predictions/models/competition.dto';
import { Season } from '@/pages/predictions/models/season.dto';

export interface MatchDto {
  id: number;
  external_id: string;
  season_id: number;
  season?: Season;
  tournament_id: number;
  tournament?: Competition;
  home_team: string | null;
  away_team: string | null;
  start_time: string | null;
  status: string;
  home_score: number | null;
  away_score: number | null;
  updated_at: string;
}
