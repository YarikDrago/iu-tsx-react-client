import { MatchDto } from '@/pages/predictions/models/match.dto';

import * as styles from '../Group.module.scss';

export const getHomeTeamResultClass = (match: MatchDto) => {
  if (match.away_score === null || match.home_score === null) return '';
  if (match.home_score === match.away_score) return styles.draw;

  return match.home_score > match.away_score ? styles.win : styles.lose;
};

export const getAwayTeamResultClass = (match: MatchDto) => {
  if (match.away_score === null || match.home_score === null) return '';
  if (match.home_score === match.away_score) return styles.draw;

  return match.home_score < match.away_score ? styles.win : styles.lose;
};
