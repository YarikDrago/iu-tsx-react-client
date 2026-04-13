import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import {
  GroupData,
  MatchPredictionUpdatePayload,
  TEditPrediction,
  TPredictionGlossary,
} from '@/pages/predictions/Group/models/models';
import PredictionEditor from '@/pages/predictions/Group/PredictionEditor';
import { calcPredictionPoints } from '@/pages/predictions/Group/utils/calcPredictionPoints';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto, MatchStatus, UpsertMatchInput } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';
import { socket } from '@/shared/ws/socket';

import * as styles from './Group.module.scss';

interface TGroupGeneralData {
  name: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
}

const Group = () => {
  const { ready } = useRequireAccessToken();
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const [groupGeneralData, setGroupGeneralData] = React.useState<TGroupGeneralData | null>(null);
  const matchesRef = useRef<MatchDto[]>([]);
  const [matches, setMatches] = React.useState<MatchDto[]>([]);
  // const [members, setMembers] = useState<GroupMember[]>([]);
  const membersRef = useRef<GroupMember[]>([]);
  /* Predictions data */
  const [predictions, setPredictions] = useState<PredictionDto[]>([]);
  const predictionsRef = useRef<PredictionDto[]>([]);
  const predictionGlossaryRef = useRef<TPredictionGlossary>({});
  const [predictionGlossary, setPredictionGlossary] = React.useState<TPredictionGlossary>({});
  const [errorMsg, setErrorMsg] = React.useState('');
  const [editPrediction, setEditPrediction] = React.useState<TEditPrediction | null>(null);

  if (groupId === undefined || Number.isNaN(groupId)) {
    return (
      <div>
        <p className={'errorMsg'}>Invalid group id</p>
      </div>
    );
  }

  // useEffect(() => {
  //   console.log('members change:', members);
  // }, [members]);

  useEffect(() => {
    if (!ready) return;
    getGroup();
  }, [ready]);

  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  useEffect(() => {
    predictionsRef.current = predictions;
  }, [predictions]);

  useEffect(() => {
    predictionGlossaryRef.current = predictionGlossary;
  }, [predictionGlossary]);

  useEffect(() => {
    if (!ready) return;
    if (!id) return;

    if (Number.isNaN(groupId)) return;

    /* Connecting to group room via WS */
    socket.emit('group:join', { groupId }, (ack: { ok: boolean; error?: string } | undefined) => {
      if (!ack) {
        appData.addToast('Could not get response from WS server (group:join)', 'error');
        return;
      }
      if (!ack.ok) {
        appData.addToast(`WS group connection error: ${ack.error ?? 'unknown error'}`, 'error');
      } else {
        console.log('Joined group room via WS:', groupId);
      }
    });

    const handleGroupPredictionUpdate = (payload: MatchPredictionUpdatePayload) => {
      try {
        if (payload.group_id != groupId) {
          const errorMsg = `WS ERROR: group_id != ${groupId}`;
          appData.addToast(errorMsg, 'error');
          console.error(errorMsg);
          return;
        }
        const matches = matchesRef.current;
        const matchIdx = matches.findIndex((m) => m.id == payload.match_id);
        // console.log('payload:', payload);
        const user = membersRef.current.find((m) => m.user_id == payload.user_id);
        if (matchIdx === undefined || user === undefined) {
          console.error('match or user not found', matchIdx, user);
          // console.log('members:', membersRef.current);
          appData.addToast(`WS ERROR: match or user not found`, 'error');
          return;
        }
        const match = matches[matchIdx]!;
        const predictions = predictionsRef.current;
        /* Rewrite prediction in group.predictions array */
        const predictionIdx = predictionGlossaryRef.current[payload.user_id]?.[payload.match_id];
        /* Add new prediction */
        if (predictionIdx === null || predictionIdx === undefined) {
          predictions.push({
            id: payload.id,
            user_id: payload.user_id,
            group_id: groupId,
            match_id: payload.match_id,
            home_score: payload.home_score,
            away_score: payload.away_score,
          });
          /* Add to the glossary */
          const newPredictionGlossary: TPredictionGlossary = { ...predictionGlossaryRef.current };
          if (newPredictionGlossary[payload.user_id] === undefined) {
            newPredictionGlossary[payload.user_id] = {};
          }
          newPredictionGlossary[payload.user_id][payload.match_id] = predictions.length - 1;
          setPredictionGlossary(newPredictionGlossary);
          setPredictions(predictions);
        } else {
          /* Rewrite old prediction data */
          const newPredictions = [...predictions];
          newPredictions[predictionIdx].away_score = payload.away_score;
          newPredictions[predictionIdx].home_score = payload.home_score;
          // TODO rewrite updated_at
          setPredictions(newPredictions);
        }
        appData.addToast(
          `${user.nickname} change prediction. ID ${matchIdx + 1} | ${match.home_team}-${match.away_team} | ${payload.home_score} - ${payload.away_score}`,
          'info'
        );
      } catch (e) {
        console.error('handle group prediction update error', e);
      }
    };

    const handleMatchesUpdate = (payload: UpsertMatchInput[]) => {
      const newMatches = [...matchesRef.current];
      for (const match of payload) {
        const idx = newMatches.findIndex((m) => m.external_id == String(match.externalId));
        if (idx >= 0) {
          newMatches[idx].home_score = match.homeScore;
          newMatches[idx].away_score = match.awayScore;
          newMatches[idx].status = match.status;
        }
      }
      setMatches(newMatches);
    };

    socket.on('group:test', handleGroupPredictionUpdate);
    socket.on('matches', handleMatchesUpdate);

    return () => {
      socket.off('group:test', handleGroupPredictionUpdate);
      socket.off('matches', handleMatchesUpdate);
    };
  }, [ready, id]);

  async function getGroup() {
    try {
      appData.showLoader();
      setErrorMsg('');
      const group = await universalFetchRequest<GroupData>(
        `tournaments/groups/${id}/predictions`,
        HTMLRequestMethods.GET,
        {}
      );
      // console.log('group:', group);
      const sortedMembers: GroupMember[] = group.group.members.sort(
        (a, b) => a.user_id - b.user_id
      );
      membersRef.current = sortedMembers;
      const newPredictionGlossary: TPredictionGlossary = {};
      sortedMembers.forEach((member) => {
        newPredictionGlossary[member.user_id] = {};
      });
      group.predictions.forEach((prediction, idx) => {
        newPredictionGlossary[prediction.user_id][prediction.match_id] = idx;
      });
      setPredictions(group.predictions);
      setPredictionGlossary(newPredictionGlossary);
      setMatches(group.matches);
      /* At the end */
      setGroupGeneralData({
        name: group.group.name,
        tournamentName: group.group.tournament.name,
        startDate: group.group.season.start_date,
        endDate: group.group.season.end_date,
      });
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <div>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.myGroups, routes.group]} />
      {groupGeneralData !== null && (
        <>
          <div>
            <h1>{groupGeneralData?.name}</h1>
            <h3>{`Tournament: ${groupGeneralData?.tournamentName}`}</h3>
            <h3>{`Season: ${groupGeneralData?.startDate} - ${groupGeneralData?.endDate}`}</h3>
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
                    {membersRef.current.map((member) => {
                      return <th key={member.user_id}>{member.nickname}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, idx) => {
                    // console.log('match:', match);
                    // console.log('match', match.home_team, match.away_team);
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
                            groupId: groupId,
                            match: match,
                            prediction:
                              predictionGlossary[appData.userId]?.[match.id] !== null &&
                              predictionGlossary[appData.userId]?.[match.id] !== undefined
                                ? predictions[predictionGlossary[appData.userId][match.id]!]
                                : null,
                          });
                        }}
                        onMouseEnter={() => {
                          console.log(match);
                        }}
                      >
                        {/* Row number */}
                        <td>{idx + 1}</td>
                        {/* Home team name */}
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
                        {/* Away team name */}
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
                        {/* Date */}
                        <td
                          className={match.status === MatchStatus.FINISHED ? styles.finished : ''}
                        >
                          {match.start_time || 'scheduled'}
                        </td>
                        {/* Match status */}
                        <td
                          className={match.status === MatchStatus.FINISHED ? styles.finished : ''}
                        >
                          {match.status}
                        </td>
                        {/* Match score */}
                        <td>{`${String(match.home_score)} - ${String(match.away_score)}`}</td>
                        {/* Member predictions */}
                        {membersRef.current.map((member) => {
                          // console.log('member:', member);
                          let predictionHome = 'null';
                          let predictionAway = 'null';
                          let gainedPoints = 0;
                          const predictionIdx = predictionGlossary[member.user_id]?.[match.id];
                          // console.log('predictionIdx:', predictionIdx);
                          if (predictionIdx !== null && predictionIdx !== undefined) {
                            const prediction = predictions[predictionIdx];
                            if (prediction) {
                              predictionHome = String(prediction.home_score);
                              predictionAway = String(prediction.away_score);
                              gainedPoints = calcPredictionPoints(match, prediction);
                            } else {
                              console.error('prediction is null', idx, member.nickname);
                            }
                          }
                          let predictionText = `${predictionHome} - ${predictionAway}`;
                          if (
                            match.status === MatchStatus.FINISHED ||
                            match.status === MatchStatus.IN_PLAY
                          )
                            predictionText += ` (${gainedPoints})`;
                          return <td key={member.id}>{predictionText}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
