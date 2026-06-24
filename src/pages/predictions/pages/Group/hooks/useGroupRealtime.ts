import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';

import appData from '@/app.data';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto, UpsertMatchInput } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import {
  MatchPredictionUpdatePayload,
  TPredictionGlossary,
} from '@/pages/predictions/pages/Group/models/models';
import { showSystemNotification } from '@/shared/notifications/systemNotifications';
import { socket } from '@/shared/ws/socket';

interface UseGroupRealtimeParams {
  ready: boolean;
  id?: string;
  groupId: number;
  matchesRef: RefObject<MatchDto[]>;
  membersRef: RefObject<GroupMember[]>;
  predictionsRef: RefObject<PredictionDto[]>;
  predictionGlossaryRef: RefObject<TPredictionGlossary>;
  setMatches: Dispatch<SetStateAction<MatchDto[]>>;
  setPredictions: Dispatch<SetStateAction<PredictionDto[]>>;
  setPredictionGlossary: Dispatch<SetStateAction<TPredictionGlossary>>;
}

export const useGroupRealtime = ({
  ready,
  id,
  groupId,
  matchesRef,
  membersRef,
  predictionsRef,
  predictionGlossaryRef,
  setMatches,
  setPredictions,
  setPredictionGlossary,
}: UseGroupRealtimeParams) => {
  useEffect(() => {
    if (!ready || !id || Number.isNaN(groupId)) return;

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
        const user = membersRef.current.find((m) => m.user_id == payload.user_id);
        if (matchIdx < 0 || user === undefined) {
          console.error('match or user not found', matchIdx, user);
          appData.addToast('WS ERROR: match or user not found', 'error');
          return;
        }

        const match = matches[matchIdx]!;
        const predictionIdx = predictionGlossaryRef.current[payload.user_id]?.[payload.match_id];

        if (predictionIdx === null || predictionIdx === undefined) {
          const newPredictions = [
            ...predictionsRef.current,
            {
              id: payload.id,
              user_id: payload.user_id,
              group_id: groupId,
              match_id: payload.match_id,
              home_score: payload.home_score,
              away_score: payload.away_score,
            },
          ];
          const newPredictionGlossary: TPredictionGlossary = { ...predictionGlossaryRef.current };

          if (newPredictionGlossary[payload.user_id] === undefined) {
            newPredictionGlossary[payload.user_id] = {};
          }

          newPredictionGlossary[payload.user_id] = {
            ...newPredictionGlossary[payload.user_id],
            [payload.match_id]: newPredictions.length - 1,
          };
          setPredictionGlossary(newPredictionGlossary);
          setPredictions(newPredictions);
        } else {
          const newPredictions = [...predictionsRef.current];

          newPredictions[predictionIdx] = {
            ...newPredictions[predictionIdx],
            away_score: payload.away_score,
            home_score: payload.home_score,
          };
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
          const previousMatch = newMatches[idx];
          const isScoreChanged =
            previousMatch.home_score !== match.homeScore ||
            previousMatch.away_score !== match.awayScore;

          newMatches[idx] = {
            ...previousMatch,
            home_score: match.homeScore,
            away_score: match.awayScore,
            status: match.status,
          };

          if (isScoreChanged) {
            const homeTeam = previousMatch.home_team ?? match.homeTeam ?? 'Home team';
            const awayTeam = previousMatch.away_team ?? match.awayTeam ?? 'Away team';
            const homeScore = match.homeScore ?? '-';
            const awayScore = match.awayScore ?? '-';

            void showSystemNotification('Match score changed', {
              body: `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
              tag: `match-score-${previousMatch.id}`,
            });
          }
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
  }, [ready, id, groupId]);
};
