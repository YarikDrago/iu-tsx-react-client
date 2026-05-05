import React from 'react';
import { useParams } from 'react-router';

import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import { GroupTable } from './components/GroupTable';
import { useGroupData } from './hooks/useGroupData';
import { useGroupRealtime } from './hooks/useGroupRealtime';
import { TEditPrediction } from './models/models';
import PredictionEditor from './PredictionEditor';

const Group = () => {
  const { ready } = useRequireAccessToken();
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const [editPrediction, setEditPrediction] = React.useState<TEditPrediction | null>(null);
  const {
    groupGeneralData,
    matches,
    members,
    predictions,
    predictionGlossary,
    errorMsg,
    memberScores,
    matchesRef,
    membersRef,
    predictionsRef,
    predictionGlossaryRef,
    setMatches,
    setPredictions,
    setPredictionGlossary,
  } = useGroupData(ready, groupId, id);

  useGroupRealtime({
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
  });

  if (groupId === undefined || Number.isNaN(groupId)) {
    return (
      <div>
        <p className={'errorMsg'}>Invalid group id</p>
      </div>
    );
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
            <GroupTable
              groupId={groupId}
              matches={matches}
              members={members}
              memberScores={memberScores}
              predictions={predictions}
              predictionGlossary={predictionGlossary}
              onEditPrediction={setEditPrediction}
            />
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
