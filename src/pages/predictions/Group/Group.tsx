import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import PredictionEditor from '@/pages/predictions/Group/PredictionEditor';
import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import { Season } from '@/pages/predictions/models/season.dto';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './Group.module.scss';

interface GroupDto {
  id: number;
  name: string;
  tournament: Competition;
  season: Season;
  members: GroupMember[];
}

interface GroupData {
  group: GroupDto;
  matches: MatchDto[];
  predictions: PredictionDto[];
}

interface PredictionTable {
  // key- user_id
  [key: number]: {
    // key- match_id, value - prediction index in array
    [key: number]: number | null;
  };
}

export interface TEditPrediction {
  groupId: number;
  match: MatchDto;
  prediction: PredictionDto | null;
}

const Group = () => {
  const { ready } = useRequireAccessToken();
  const { id } = useParams<{ id: string }>();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [group, setGroup] = React.useState<GroupData | null>(null);
  const [members, setMembers] = React.useState<GroupMember[]>([]);
  const [predictionTable, setPredictionTable] = React.useState<PredictionTable>({});
  const [editPrediction, setEditPrediction] = React.useState<TEditPrediction | null>(null);

  useEffect(() => {
    if (!ready) return;
    console.log('ready');
    getGroup();
  }, [ready]);

  async function getGroup() {
    try {
      appData.showLoader();
      setErrorMsg('');
      const group = await universalFetchRequest<GroupData>(
        `tournaments/groups/${id}/predictions`,
        HTMLRequestMethods.GET,
        {}
      );
      console.log(group);
      const sortedMembers: GroupMember[] = group.group.members.sort(
        (a, b) => a.user_id - b.user_id
      );
      setMembers(sortedMembers);
      // TODO rewrite use only group data
      const newPredictionData: PredictionTable = {};
      sortedMembers.forEach((member) => {
        newPredictionData[member.user_id] = {};
      });
      group.predictions.forEach((prediction, idx) => {
        newPredictionData[prediction.user_id][prediction.match_id] = idx;
      });
      setPredictionTable(newPredictionData);
      setGroup(group);
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <div>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.myGroups, routes.group]} />
      {group && (
        <>
          <div>
            <h1>{group.group.name}</h1>
            <h3>{`Tournament: ${group.group.tournament.name}`}</h3>
            <h3>{`Season: ${group.group.season.start_date} - ${group.group.season.end_date}`}</h3>
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
                    return <th key={member.user_id}>{member.nickname}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {group.matches.map((match, idx) => {
                  return (
                    <tr
                      key={match.id}
                      onClick={() => {
                        if (
                          match.status === MatchStatus.FINISHED ||
                          match.status === MatchStatus.IN_PLAY
                        )
                          return;
                        setEditPrediction({
                          groupId: group?.group.id,
                          match: match,
                          prediction:
                            predictionTable[appData.userId]?.[match.id] !== null &&
                            predictionTable[appData.userId]?.[match.id] !== undefined
                              ? group?.predictions[predictionTable[appData.userId][match.id]!]
                              : null,
                        });
                      }}
                    >
                      <td>{idx + 1}</td>
                      <td
                        className={
                          match.away_score === null || match.home_score === null
                            ? ''
                            : match.home_score === match.away_score
                              ? styles.draw
                              : match.home_score > match.away_score
                                ? styles.win
                                : styles.lose
                        }
                      >
                        {match.home_team || '???'}
                      </td>
                      <td
                        className={
                          match.away_score === null || match.home_score === null
                            ? ''
                            : match.home_score === match.away_score
                              ? styles.draw
                              : match.home_score < match.away_score
                                ? styles.win
                                : styles.lose
                        }
                      >
                        {match.away_team || '???'}
                      </td>
                      <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                        {match.start_time || 'scheduled'}
                      </td>
                      <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                        {match.status}
                      </td>
                      <td>{`${String(match.home_score)} - ${String(match.away_score)}`}</td>
                      {members.map((member) => {
                        let predictionHome = 'null';
                        let predictionAway = 'null';
                        // TODO change on real calculated value
                        const gainedPoints = 0;
                        const predictionIdx = predictionTable[member.user_id]?.[match.id];
                        if (predictionIdx !== null && predictionIdx !== undefined) {
                          const prediction = group.predictions[predictionIdx];
                          predictionHome = String(prediction.home_score);
                          predictionAway = String(prediction.away_score);
                        }
                        let text = `${predictionHome} - ${predictionAway}`;
                        if (
                          match.status === MatchStatus.FINISHED ||
                          match.status === MatchStatus.IN_PLAY
                        )
                          text += ` (${gainedPoints})`;
                        return <td key={member.id}>{text}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {errorMsg !== '' && <p>{errorMsg}</p>}
      {editPrediction && (
        <PredictionEditor
          editData={editPrediction}
          onClose={() => {
            setEditPrediction(null);
          }}
        />
      )}
    </div>
  );
};

export default Group;
