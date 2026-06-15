import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';

const getActualScore = (match: MatchDto, score: number | null) => {
  if (score !== null) return score;
  if (match.status === MatchStatus.IN_PLAY || match.status === MatchStatus.FINISHED) return 0;

  return null;
};

export function calcPredictionPenaltyScore(match: MatchDto, prediction: PredictionDto): number {
  const homeScore = getActualScore(match, match.home_score);
  const awayScore = getActualScore(match, match.away_score);

  if (
    homeScore === null ||
    awayScore === null ||
    prediction.home_score === null ||
    prediction.away_score === null
  ) {
    return 0;
  }

  return Math.abs(homeScore - prediction.home_score) + Math.abs(awayScore - prediction.away_score);
}
