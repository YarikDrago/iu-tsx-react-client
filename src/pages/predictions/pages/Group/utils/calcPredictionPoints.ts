import { MatchDto } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';

export function calcPredictionPoints(match: MatchDto, prediction: PredictionDto): number {
  if (
    match.home_score === null ||
    match.away_score === null ||
    prediction.home_score === null ||
    prediction.away_score === null
  )
    return 0;
  if (match.home_score === prediction.home_score && match.away_score === prediction.away_score) {
    return 3;
  }
  const matchDiff = match.home_score - match.away_score;
  const predictionDiff = prediction.home_score - prediction.away_score;
  if (matchDiff === predictionDiff) {
    return 2;
  }
  if (matchDiff * predictionDiff > 0) return 1;
  return 0;
}
