import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import * as teamResultStyles from '@/shared/styles/teamResult.module.scss';

const getActualScore = (match: MatchDto, score: number | null) => {
  if (score !== null) return score;
  if (match.status === MatchStatus.IN_PLAY || match.status === MatchStatus.FINISHED) return 0;

  return null;
};

export const getHomeTeamResultClass = (match: MatchDto) => {
  const homeScore = getActualScore(match, match.home_score);
  const awayScore = getActualScore(match, match.away_score);

  if (awayScore === null || homeScore === null) return '';
  if (homeScore === awayScore) return teamResultStyles.draw;

  return homeScore > awayScore ? teamResultStyles.win : teamResultStyles.lose;
};

export const getAwayTeamResultClass = (match: MatchDto) => {
  const homeScore = getActualScore(match, match.home_score);
  const awayScore = getActualScore(match, match.away_score);

  if (awayScore === null || homeScore === null) return '';
  if (homeScore === awayScore) return teamResultStyles.draw;

  return homeScore < awayScore ? teamResultStyles.win : teamResultStyles.lose;
};
