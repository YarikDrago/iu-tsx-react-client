export interface Competition {
  id: number;
  external_id: number;
  name: string;
  isObservable: boolean; // true
  currentSeason?: {
    id: string;
    external_id: string;
    tournament_id: number;
    start_date: string;
    end_date: string;
    isCurrent: boolean; // true
    created_at: Date;
    updated_at: Date;
  };
}
