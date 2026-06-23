import React from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import {
  getGroupNotificationSettings,
  GetTelegramGroupNotificationSettingsDto,
  // GroupNotificationSettingsDto,
} from '@/function/api/getGroupNotificationSettings';
import { patchGroupNotificationSettings } from '@/function/api/patchGroupNotificationSettings';
import { MatchDto } from '@/pages/predictions/models/match.dto';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { Switcher } from '@/shared/components/Switcher';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as tournamentStyles from '../Tournament/Tournament.module.scss';
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
  const [notificationSettings, setNotificationSettings] =
    React.useState<GetTelegramGroupNotificationSettingsDto | null>(null);
  const [notificationErrorMsg, setNotificationErrorMsg] = React.useState('');
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

  React.useEffect(() => {
    if (!ready || !id || Number.isNaN(groupId)) return;

    const getNotificationSettings = async () => {
      try {
        console.log('getGroupNotificationSettings');
        setNotificationErrorMsg('');

        const notificationSettings = await getGroupNotificationSettings(id);
        console.log('notificationSettings', notificationSettings);

        setNotificationSettings(notificationSettings);
      } catch (e) {
        setNotificationErrorMsg((e as Error).message);
      }
    };

    getNotificationSettings();
  }, [ready, id, groupId]);

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

  const handleNotificationSettingsChange = async (
    key: keyof GetTelegramGroupNotificationSettingsDto
  ) => {
    console.log('handleNotificationSettingsChange', key);
    if (!id || notificationSettings === null) return;

    const previousSettings = notificationSettings;
    const nextSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };

    try {
      setNotificationErrorMsg('');
      appData.showLoader();
      setNotificationSettings(nextSettings);

      const updatedSettings = await patchGroupNotificationSettings(id, nextSettings);

      setNotificationSettings(updatedSettings);
    } catch (e) {
      const message = (e as Error).message;

      setNotificationSettings(previousSettings);
      setNotificationErrorMsg(message);
      appData.addToast(message, 'error');
    } finally {
      appData.hideLoader();
    }
  };

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
            {appData.role.includes('admin') && (
              <div className={tournamentStyles.notificationSettings}>
                <p className={tournamentStyles.notificationTitle}>Notification settings</p>
                <Switcher
                  label="Prediction reminder"
                  checked={Boolean(notificationSettings?.notifyPredictionReminder)}
                  disabled={notificationSettings === null}
                  onChange={() => handleNotificationSettingsChange('notifyPredictionReminder')}
                />
              </div>
            )}
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
      {notificationErrorMsg !== '' && <p className={styles.errorMsg}>{notificationErrorMsg}</p>}
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
