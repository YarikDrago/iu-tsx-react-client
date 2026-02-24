export interface PredictionDto {
  id: number;
  user_id: number;
  user?: unknown;
  group_id: number;
  group?: unknown;
  match_id: number;
  match?: unknown;
  home_score: number;
  away_score: number;
  created_at?: string;
  updated_at?: string;
}
