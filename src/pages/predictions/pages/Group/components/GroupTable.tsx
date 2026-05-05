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

interface GroupTableProps {
  groupId: number;
  matches: MatchDto[];
  members: GroupMember[];
  memberScores: Record<number, number>;
  predictions: PredictionDto[];
  predictionGlossary: TPredictionGlossary;
  onEditPrediction: (editPrediction: TEditPrediction) => void;
}

const isPredictionLocked = (match: MatchDto) => {
  return match.status === MatchStatus.FINISHED || match.status === MatchStatus.IN_PLAY;
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
    predictionText += ` (${calcPredictionPoints(match, prediction)})`;
  }

  return predictionText;
};

export const GroupTable = ({
  groupId,
  matches,
  members,
  memberScores,
  predictions,
  predictionGlossary,
  onEditPrediction,
}: GroupTableProps) => {
  return (
    <div className={'tableWrapper'}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Home team</th>
            <th>Away team</th>
            <th>Date</th>
            <th>Status</th>
            <th>Score</th>
            {members.map((member) => {
              return (
                <th key={member.user_id}>
                  {member.nickname} ({memberScores[member.user_id] ?? 0})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {matches.map((match, idx) => {
            return (
              <tr
                key={match.id}
                onClick={() => {
                  if (isPredictionLocked(match)) return;

                  const predictionIdx = predictionGlossary[appData.userId]?.[match.id];

                  onEditPrediction({
                    groupId,
                    match,
                    prediction:
                      predictionIdx !== null && predictionIdx !== undefined
                        ? predictions[predictionIdx]
                        : null,
                  });
                }}
                onMouseEnter={() => {
                  console.log(match);
                }}
              >
                <td>{idx + 1}</td>
                <td className={getHomeTeamResultClass(match)}>{match.home_team || '???'}</td>
                <td className={getAwayTeamResultClass(match)}>{match.away_team || '???'}</td>
                <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                  {formatLocalDDMMYY_HHMM(match.start_time, false) || 'scheduled'}
                </td>
                <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                  {match.status}
                </td>
                <td>{`${String(match.home_score)} - ${String(match.away_score)}`}</td>
                {members.map((member) => {
                  return (
                    <td key={member.id}>
                      {getPredictionText(match, member, predictions, predictionGlossary)}
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
