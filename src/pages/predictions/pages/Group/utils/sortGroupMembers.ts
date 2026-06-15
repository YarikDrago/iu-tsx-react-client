import appData from '@/app.data';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';

export const sortGroupMembers = (
  members: GroupMember[],
  memberScores?: Record<number, number>,
  memberPenaltyScores?: Record<number, number>
) => {
  return [...members].sort((a, b) => {
    if (a.user_id === appData.userId && b.user_id !== appData.userId) return -1;
    if (b.user_id === appData.userId && a.user_id !== appData.userId) return 1;
    if (memberScores && memberPenaltyScores) {
      const scoreDiff = (memberScores[b.user_id] ?? 0) - (memberScores[a.user_id] ?? 0);
      if (scoreDiff !== 0) return scoreDiff;

      const penaltyScoreDiff =
        (memberPenaltyScores[a.user_id] ?? 0) - (memberPenaltyScores[b.user_id] ?? 0);
      if (penaltyScoreDiff !== 0) return penaltyScoreDiff;
    }

    if (a.user_id === appData.userId && b.user_id !== appData.userId) return -1;
    if (b.user_id === appData.userId && a.user_id !== appData.userId) return 1;

    return a.nickname.localeCompare(b.nickname);
  });
};
