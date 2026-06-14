import { Competition } from '@/pages/predictions/models/competition.dto';
import { Season } from '@/pages/predictions/models/season.dto';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  POSTPONED = 'POSTPONED',
  SUSPENDED = 'SUSPENDED',
  TIMED = 'TIMED',
  IN_PLAY = 'IN_PLAY',
  FINISHED = 'FINISHED',
  // CANCELLED = 'CANCELLED',
  // AWARDED = 'AWARDED',
}

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
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  updated_at: string;
}

export type UpsertMatchInput = {
  externalId: number;
  seasonExternalId: number;
  tournamentExternalId: number;
  homeTeam: string; // name of the team
  awayTeam: string; // name of the team
  startTime: Date | null;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
};

export class ManualUpdateMatchDto {
  homeTeam?: string | null;
  home_team?: string | null;
  awayTeam?: string | null;
  away_team?: string | null;
  startTime?: string | Date | null;
  start_time?: string | Date | null;
  status?: MatchStatus | null;
  homeScore?: number | null;
  home_score?: number | null;
  awayScore?: number | null;
  away_score?: number | null;
}
