import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { MatchDto } from '@/pages/predictions/models/match.dto';
import { Season } from '@/pages/predictions/models/season.dto';

export interface TournamentDataDto {
  id: number;
  external_id: number;
  name: string;
  season?: Season;
  matches: MatchDto[];
}

export async function getTournamentData(tournamentID: string | number) {
  return await universalFetchRequest<TournamentDataDto>(
    `tournaments/${tournamentID}/matches`,
    HTMLRequestMethods.GET,
    {}
  );
}
