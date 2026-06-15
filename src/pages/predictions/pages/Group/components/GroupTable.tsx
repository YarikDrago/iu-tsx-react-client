import React from 'react';

import appData from '@/app.data';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import {
  TEditPrediction,
  TPredictionGlossary,
} from '@/pages/predictions/pages/Group/models/models';
import { calcPredictionPoints } from '@/pages/predictions/pages/Group/utils/calcPredictionPoints';
import {
  getAwayTeamResultClass,
  getHomeTeamResultClass,
} from '@/pages/predictions/pages/Group/utils/getTeamResultClass';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from '../Group.module.scss';
import { calcPredictionPenaltyScore } from '../utils/calcPredictionPenaltyScore';

interface GroupTableProps {
  groupId: number;
  matches: MatchDto[];
  members: GroupMember[];
  memberScores: Record<number, number>;
  memberTotalPenaltyScores: Record<number, number>;
  predictions: PredictionDto[];
  predictionGlossary: TPredictionGlossary;
  onEditPrediction: (editPrediction: TEditPrediction) => void;
  onEditMatchScore: (match: MatchDto) => void;
}

const isPredictionLocked = (match: MatchDto) => {
  return match.status === MatchStatus.FINISHED || match.status === MatchStatus.IN_PLAY;
};

const shouldShowScore = (match: MatchDto) => {
  return match.status === MatchStatus.IN_PLAY || match.status === MatchStatus.FINISHED;
};

const formatMatchScorePart = (match: MatchDto, score: number | null) => {
  if (score !== null) return String(score);
  if (isPredictionLocked(match)) return '0';

  return '-';
};

const getMatchTimeParts = (match: MatchDto) => {
  if (!match.start_time) {
    return ['scheduled', ''];
  }

  const [date, time] = formatLocalDDMMYY_HHMM(match.start_time, false).split(' ');

  return [date, time ?? ''];
};

const getPredictionText = (
  match: MatchDto,
  member: GroupMember,
  predictions: PredictionDto[],
  predictionGlossary: TPredictionGlossary
) => {
  const predictionIdx = predictionGlossary[member.user_id]?.[match.id];

  if (predictionIdx === null || predictionIdx === undefined) {
    return 'null - null';
  }

  const prediction = predictions[predictionIdx];
  if (!prediction) {
    console.error('prediction is null', match.id, member.nickname);
    return 'null - null';
  }

  let predictionText = `${prediction.home_score} - ${prediction.away_score}`;

  if (isPredictionLocked(match)) {
    predictionText += ` (${calcPredictionPoints(match, prediction)} | ${calcPredictionPenaltyScore(
      match,
      prediction
    )})`;
  }

  return predictionText;
};

export const GroupTable = ({
  groupId,
  matches,
  members,
  memberScores,
  memberTotalPenaltyScores,
  predictions,
  predictionGlossary,
  onEditPrediction,
  onEditMatchScore,
}: GroupTableProps) => {
  const initialScrollTargetRef = React.useRef<HTMLTableRowElement | null>(null);
  const hasScrolledToInitialMatchRef = React.useRef(false);
  const initialScrollTargetMatchId = React.useMemo(() => {
    const firstUnfinishedMatch = matches.find((match) => match.status !== MatchStatus.FINISHED);

    return firstUnfinishedMatch?.id ?? matches[matches.length - 1]?.id ?? null;
  }, [matches]);

  React.useEffect(() => {
    /* Scroll only once with first render of matches */
    if (hasScrolledToInitialMatchRef.current) return;
    if (initialScrollTargetMatchId === null) return;

    initialScrollTargetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    hasScrolledToInitialMatchRef.current = true;
  }, [initialScrollTargetMatchId]);

  function editPrediction(match: MatchDto) {
    if (isPredictionLocked(match)) return;

    const predictionIdx = predictionGlossary[appData.userId]?.[match.id];

    onEditPrediction({
      groupId,
      match,
      prediction:
        predictionIdx !== null && predictionIdx !== undefined ? predictions[predictionIdx] : null,
    });
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.matchColumn} />
          {members.map((member) => (
            <col key={member.user_id} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className={styles.matchColumn}>Match</th>
            {members.map((member) => {
              return (
                <th key={member.user_id}>
                  {member.nickname} ({memberScores[member.user_id] ?? 0} |{' '}
                  {memberTotalPenaltyScores[member.user_id] ?? 0})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            const [matchDate, matchTime] = getMatchTimeParts(match);
            const showScore = shouldShowScore(match);

            return (
              <tr
                key={match.id}
                /* Ref for start render scrolling */
                ref={match.id === initialScrollTargetMatchId ? initialScrollTargetRef : null}
                onClick={() => {
                  editPrediction(match);
                }}
                // onMouseEnter={() => {
                //   console.log(match);
                // }}
              >
                <td className={styles.matchCell}>
                  <div className={styles.matchPair}>
                    <div
                      className={`${styles.matchPairItem} ${styles.teamName} ${getHomeTeamResultClass(
                        match
                      )}`}
                    >
                      {match.home_team || '???'}
                    </div>
                    <div
                      className={`${styles.matchPairItem} ${styles.teamName} ${getAwayTeamResultClass(
                        match
                      )}`}
                    >
                      {match.away_team || '???'}
                    </div>
                  </div>
                  <div className={styles.matchControls}>
                    {showScore ? (
                      <div
                        className={`${styles.matchPair} ${styles.matchScore} ${
                          match.status === MatchStatus.IN_PLAY ? styles.liveScore : ''
                        }`}
                      >
                        <div className={styles.matchPairItem}>
                          {formatMatchScorePart(match, match.home_score)}
                        </div>
                        <div className={styles.matchPairItem}>
                          {formatMatchScorePart(match, match.away_score)}
                        </div>
                      </div>
                    ) : (
                      <div className={`${styles.matchPair} ${styles.matchTime}`}>
                        <div className={styles.matchPairItem}>{matchDate}</div>
                        <div className={styles.matchPairItem}>{matchTime}</div>
                      </div>
                    )}
                    {appData.role.includes('admin') && (
                      <button
                        className={'admin'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMatchScore(match);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
                {members.map((member) => {
                  const withEditButton =
                    !isPredictionLocked(match) && member.user_id === appData.userId;
                  return (
                    <td className={styles.predictionCell} key={member.id}>
                      <p>{getPredictionText(match, member, predictions, predictionGlossary)}</p>
                      {withEditButton && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            editPrediction(match);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
