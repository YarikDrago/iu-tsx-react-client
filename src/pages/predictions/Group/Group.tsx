import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import { Season } from '@/pages/predictions/models/season.dto';
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
    // key- match_id
    [key: number]: {
      home_score: number | null;
      away_score: number | null;
    };
  };
}

const Group = () => {
  const { ready } = useRequireAccessToken();
  const { id } = useParams<{ id: string }>();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [group, setGroup] = React.useState<GroupData | null>(null);
  const [members, setMembers] = React.useState<GroupMember[]>([]);
  const [predictionTable, setPredictionTable] = React.useState<PredictionTable>({});

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
      group.predictions.forEach((prediction) => {
        newPredictionData[prediction.user_id][prediction.match_id] = {
          home_score: prediction.home_score,
          away_score: prediction.away_score,
        };
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
                    <tr key={match.id}>
                      <td>{idx + 1}</td>
                      <td>{match.home_team || '???'}</td>
                      <td>{match.away_team || '???'}</td>
                      <td>{match.start_time || 'scheduled'}</td>
                      <td>{match.status}</td>
                      <td>{`${String(match.home_score)} - ${String(match.away_score)}`}</td>
                      {members.map((member) => {
                        let predictionHome = 'null';
                        let predictionAway = 'null';
                        if (
                          predictionTable[member.user_id] &&
                          predictionTable[member.user_id][match.id]
                        ) {
                          predictionHome = String(
                            predictionTable[member.user_id][match.id].home_score
                          );
                          predictionAway = String(
                            predictionTable[member.user_id][match.id].away_score
                          );
                        }
                        return <td key={member.id}>{`${predictionHome} - ${predictionAway}`}</td>;
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
    </div>
  );
};

export default Group;
