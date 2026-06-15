import React from 'react';
import { useParams } from 'react-router';

import { MatchDto } from '@/pages/predictions/models/match.dto';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import { GroupTable } from './components/GroupTable';
import * as styles from './Group.module.scss';
import { useGroupData } from './hooks/useGroupData';
import { useGroupRealtime } from './hooks/useGroupRealtime';
import MatchScoreEditor from './MatchScoreEditor';
import { TEditPrediction } from './models/models';
import PredictionEditor from './PredictionEditor';
import { sortGroupMembers } from './utils/sortGroupMembers';

const Group = () => {
  const { ready } = useRequireAccessToken();
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const [editPrediction, setEditPrediction] = React.useState<TEditPrediction | null>(null);
  const [editMatchScore, setEditMatchScore] = React.useState<MatchDto | null>(null);
  const {
    groupGeneralData,
    matches,
    members,
    predictions,
    predictionGlossary,
    errorMsg,
    memberScores,
    memberTotalPenaltyScores,
    matchesRef,
    membersRef,
    predictionsRef,
    predictionGlossaryRef,
    setMatches,
    setPredictions,
    setPredictionGlossary,
  } = useGroupData(ready, groupId, id);

  const sortedMembers = React.useMemo(() => {
    return sortGroupMembers(members, memberScores, memberTotalPenaltyScores);
  }, [members, memberScores, memberTotalPenaltyScores]);

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

  const handleMatchScoreSaved = React.useCallback(
    (updatedMatch: MatchDto) => {
      setMatches((prevMatches) =>
        prevMatches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match))
      );
    },
    [setMatches]
  );

  if (groupId === undefined || Number.isNaN(groupId)) {
    return (
      <article className={styles.page}>
        <p className={styles.errorMsg}>Invalid group id</p>
      </article>
    );
  }

  return (
    <article className={styles.page}>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.myGroups, routes.group]} />
      {groupGeneralData !== null && (
        <section className={styles.content}>
          <header className={styles.hero}>
            <div className={styles.titleBlock}>
              <p className={styles.eyebrow}>Prediction group</p>
              <h1 className={styles.title}>{groupGeneralData?.name}</h1>
            </div>
            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <span>Tournament</span>
                <strong>{groupGeneralData?.tournamentName}</strong>
              </div>
              <div className={styles.metaItem}>
                <span>Season</span>
                <strong>{`${groupGeneralData?.startDate} - ${groupGeneralData?.endDate}`}</strong>
              </div>
            </div>
          </header>
          <div className={styles.tableSection}>
            <GroupTable
              groupId={groupId}
              matches={matches}
              members={sortedMembers}
              memberScores={memberScores}
              memberTotalPenaltyScores={memberTotalPenaltyScores}
              predictions={predictions}
              predictionGlossary={predictionGlossary}
              onEditPrediction={setEditPrediction}
              onEditMatchScore={setEditMatchScore}
            />
          </div>
        </section>
      )}
      {errorMsg !== '' && <p className={styles.errorMsg}>{errorMsg}</p>}
      {editPrediction && (
        <PredictionEditor
          editData={editPrediction}
          onClose={() => {
            setEditPrediction(null);
          }}
        />
      )}
      {editMatchScore && (
        <MatchScoreEditor
          match={editMatchScore}
          onSaved={handleMatchScoreSaved}
          onClose={() => {
            setEditMatchScore(null);
          }}
        />
      )}
    </article>
  );
};

export default Group;
