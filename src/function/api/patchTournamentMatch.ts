import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { ManualUpdateMatchDto, MatchDto } from '@/pages/predictions/models/match.dto';

export async function patchTournamentMatch(matchId: number, body: ManualUpdateMatchDto) {
  return await universalFetchRequest<MatchDto | null>(
    `tournaments/matches/${matchId}`,
    HTMLRequestMethods.PATCH,
    body
  );
}
