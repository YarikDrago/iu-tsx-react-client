import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';

const getActualScore = (match: MatchDto, score: number | null) => {
  if (score !== null) return score;
  if (match.status === MatchStatus.IN_PLAY || match.status === MatchStatus.FINISHED) return 0;

  return null;
};

export function calcPredictionPoints(match: MatchDto, prediction: PredictionDto): number {
  const homeScore = getActualScore(match, match.home_score);
  const awayScore = getActualScore(match, match.away_score);

  if (
    homeScore === null ||
    awayScore === null ||
    prediction.home_score === null ||
    prediction.away_score === null
  )
    return 0;
  if (homeScore === prediction.home_score && awayScore === prediction.away_score) {
    return 3;
  }
  const matchDiff = homeScore - awayScore;
  const predictionDiff = prediction.home_score - prediction.away_score;
  if (matchDiff === predictionDiff) {
    return 2;
  }
  if (matchDiff * predictionDiff > 0) return 1;
  return 0;
}
