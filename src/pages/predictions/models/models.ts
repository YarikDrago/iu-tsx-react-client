export interface FootballCompetitionsApi {
  competitions: FootballCompetitionApi[];
}

export interface FootballCompetitionBasicApi {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

/* /competitions */
export interface FootballCompetitionApi extends FootballCompetitionBasicApi {
  area: FootballAreaApi;
  // emblem: string;
  currentSeason: FootballSeasonApi;
  numberOfAvailableSeasons: number;
  lastUpdated: string;
  inDb: boolean;
  isObservable: boolean;
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

export interface FootballTeamApi {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string; // URL
}

export interface FootballMatchTimeApi {
  home: number | null;
  away: number | null;
}

export interface FootballCompetitionMatchesApi {
  competition: FootballCompetitionBasicApi;
  matches: FootballMatchApi[];
}

export interface FootballMatchApi {
  area?: FootballAreaApi;
  competition: FootballCompetitionBasicApi;
  season: FootballSeasonApi;
  id: number;
  utcDate: string;
  status: 'FINISHED' | 'TIMED' | 'SCHEDULED' | 'POSTPONED' | 'SUSPENDED';
  matchday: number;
  stage: string;
  group: string;
  lastUpdated: string;
  homeTeam: FootballTeamApi;
  awayTeam: FootballTeamApi;
  score: {
    winner: null | 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW';
    duration: string;
    fullTime: FootballMatchTimeApi;
    halfTime: FootballMatchTimeApi;
    regularTime?: FootballMatchTimeApi;
    extraTime?: FootballMatchTimeApi;
    penalties?: FootballMatchTimeApi;
  };
}
