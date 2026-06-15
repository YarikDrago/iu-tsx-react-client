import React, { useEffect, useRef, useState } from 'react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import {
  GroupData,
  GroupGeneralData,
  TPredictionGlossary,
} from '@/pages/predictions/pages/Group/models/models';
import { buildPredictionGlossary } from '@/pages/predictions/pages/Group/utils/buildPredictionGlossary';
import { calcPredictionPoints } from '@/pages/predictions/pages/Group/utils/calcPredictionPoints';
import { sortGroupMembers } from '@/pages/predictions/pages/Group/utils/sortGroupMembers';

import { calcPredictionPenaltyScore } from '../utils/calcPredictionPenaltyScore';

export const useGroupData = (ready: boolean, groupId: number, id?: string) => {
  const [groupGeneralData, setGroupGeneralData] = useState<GroupGeneralData | null>(null);
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [predictions, setPredictions] = useState<PredictionDto[]>([]);
  const [predictionGlossary, setPredictionGlossary] = useState<TPredictionGlossary>({});
  const [errorMsg, setErrorMsg] = useState('');

  const matchesRef = useRef<MatchDto[]>([]);
  const membersRef = useRef<GroupMember[]>([]);
  const predictionsRef = useRef<PredictionDto[]>([]);
  const predictionGlossaryRef = useRef<TPredictionGlossary>({});

  const memberScores = React.useMemo<Record<number, number>>(() => {
    return members.reduce<Record<number, number>>((scores, member) => {
      scores[member.user_id] = matches.reduce((totalScore, match) => {
        if (match.status !== MatchStatus.FINISHED && match.status !== MatchStatus.IN_PLAY) {
          return totalScore;
        }

        const predictionIdx = predictionGlossary[member.user_id]?.[match.id];
        if (predictionIdx === null || predictionIdx === undefined) {
          return totalScore;
        }

        const prediction = predictions[predictionIdx];
        if (!prediction) {
          return totalScore;
        }

        return totalScore + calcPredictionPoints(match, prediction);
      }, 0);

      return scores;
    }, {});
  }, [matches, members, predictions, predictionGlossary]);

  const memberTotalPenaltyScores = React.useMemo<Record<number, number>>(() => {
    return members.reduce<Record<number, number>>((scores, member) => {
      scores[member.user_id] = matches.reduce((totalScore, match) => {
        if (match.status !== MatchStatus.FINISHED && match.status !== MatchStatus.IN_PLAY) {
          return totalScore;
        }

        const predictionIdx = predictionGlossary[member.user_id]?.[match.id];
        if (predictionIdx === null || predictionIdx === undefined) {
          return totalScore;
        }

        const prediction = predictions[predictionIdx];
        if (!prediction) {
          return totalScore;
        }

        return totalScore + calcPredictionPenaltyScore(match, prediction);
      }, 0);

      return scores;
    }, {});
  }, [matches, members, predictions, predictionGlossary]);

  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  useEffect(() => {
    predictionsRef.current = predictions;
  }, [predictions]);

  useEffect(() => {
    predictionGlossaryRef.current = predictionGlossary;
  }, [predictionGlossary]);

  useEffect(() => {
    if (!ready || !id || Number.isNaN(groupId)) return;

    const getGroup = async () => {
      try {
        appData.showLoader();
        setErrorMsg('');

        const group = await universalFetchRequest<GroupData>(
          `tournaments/groups/${id}/predictions`,
          HTMLRequestMethods.GET,
          {}
        );
        const sortedMatches = group.matches
          .map((match, index) => ({ match, index }))
          .sort(({ match: a, index: aIndex }, { match: b, index: bIndex }) => {
            if (!a.start_time && !b.start_time) {
              return aIndex - bIndex;
            }

            if (!a.start_time) {
              return 1;
            }

            if (!b.start_time) {
              return -1;
            }

            return a.start_time.localeCompare(b.start_time) || aIndex - bIndex;
          })
          .map(({ match }) => match);
        const sortedMembers = sortGroupMembers(group.group.members);

        setMembers(sortedMembers);
        setPredictions(group.predictions);
        setPredictionGlossary(buildPredictionGlossary(sortedMembers, group.predictions));
        setMatches(sortedMatches);
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
    };

    getGroup();
  }, [ready, id, groupId]);

  return {
    groupGeneralData,
    matches,
    members,
    predictions,
    predictionGlossary,
    errorMsg,
    memberScores,
    memberTotalPenaltyScores: memberTotalPenaltyScores,
    matchesRef,
    membersRef,
    predictionsRef,
    predictionGlossaryRef,
    setMatches,
    setPredictions,
    setPredictionGlossary,
  };
};
