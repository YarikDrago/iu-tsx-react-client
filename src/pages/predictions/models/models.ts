export interface FootballCompetitionsApi {
  competitions: FootballCompetitionApi[];
}

export interface FootballCompetitionApi {
  id: number;
  area: FootballAreaApi;
  name: string;
  code: string;
  type: string;
  // emblem: string;
  currentSeason: FootballSeasonApi;
  numberOfAvailableSeasons: number;
  lastUpdated: string;
}

export interface FootballAreaApi {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface FootballSeasonApi {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  // winner: string | null;
}
