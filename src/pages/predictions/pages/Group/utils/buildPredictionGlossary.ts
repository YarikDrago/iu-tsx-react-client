import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { PredictionDto } from '@/pages/predictions/models/prediction.dto';
import { TPredictionGlossary } from '@/pages/predictions/pages/Group/models/models';

export const buildPredictionGlossary = (
  members: GroupMember[],
  predictions: PredictionDto[]
): TPredictionGlossary => {
  const predictionGlossary: TPredictionGlossary = {};

  members.forEach((member) => {
    predictionGlossary[member.user_id] = {};
  });

  predictions.forEach((prediction, idx) => {
    predictionGlossary[prediction.user_id][prediction.match_id] = idx;
  });

  return predictionGlossary;
};
