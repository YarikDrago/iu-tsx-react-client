import React from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { getTournamentData, TournamentDataDto } from '@/function/api/getTournamentData';
import {
  getTournamentNotificationSettings,
  TournamentNotificationSettingsDto,
} from '@/function/api/getTournamentNotificationSettings';
import { patchTournamentNotificationSettings } from '@/function/api/patchTournamentNotificationSettings';
import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import {
  getAwayTeamResultClass,
  getHomeTeamResultClass,
} from '@/pages/predictions/pages/Group/utils/getTeamResultClass';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { Switcher } from '@/shared/components/Switcher';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from '../Group/Group.module.scss';
import * as tournamentStyles from './Tournament.module.scss';

const TournamentMatchesTable = ({ matches }: { matches: MatchDto[] }) => {
  const initialScrollTargetRef = React.useRef<HTMLTableRowElement | null>(null);
  const hasScrolledToInitialMatchRef = React.useRef(false);
  const initialScrollTargetMatchId = React.useMemo(() => {
    const firstUnfinishedMatch = matches.find((match) => match.status !== MatchStatus.FINISHED);

    return firstUnfinishedMatch?.id ?? matches[matches.length - 1]?.id ?? null;
  }, [matches]);

  React.useEffect(() => {
    if (hasScrolledToInitialMatchRef.current) return;
    if (initialScrollTargetMatchId === null) return;

    initialScrollTargetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    hasScrolledToInitialMatchRef.current = true;
  }, [initialScrollTargetMatchId]);

  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.table} ${styles.readOnlyTable}`}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Home team</th>
            <th>Away team</th>
            <th>Date</th>
            <th>Status</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, idx) => (
            <tr
              key={match.id}
              ref={match.id === initialScrollTargetMatchId ? initialScrollTargetRef : null}
            >
              <td>{idx + 1}</td>
              <td className={getHomeTeamResultClass(match)}>{match.home_team || '???'}</td>
              <td className={getAwayTeamResultClass(match)}>{match.away_team || '???'}</td>
              <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                {formatLocalDDMMYY_HHMM(match.start_time, false) || 'scheduled'}
              </td>
              <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                {match.status}
              </td>
              <td>{`${String(match.home_score)} - ${String(match.away_score)}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Tournament = () => {
  const { ready } = useRequireAccessToken();
  const { tournamentID } = useParams<{ tournamentID: string }>();
  const tournamentId = Number(tournamentID);
  const [tournamentData, setTournamentData] = React.useState<TournamentDataDto | null>(null);
  const [notificationSettings, setNotificationSettings] =
    React.useState<TournamentNotificationSettingsDto | null>(null);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (!ready || !tournamentID || Number.isNaN(tournamentId)) return;

    const getTournament = async () => {
      try {
        appData.showLoader();
        setErrorMsg('');

        const [data, notificationSettings] = await Promise.all([
          getTournamentData(tournamentID),
          getTournamentNotificationSettings(tournamentID),
        ]);
        setTournamentData(data);
        setNotificationSettings(notificationSettings.notificationSettings);
      } catch (e) {
        setErrorMsg((e as Error).message);
      } finally {
        appData.hideLoader();
      }
    };

    getTournament();
  }, [ready, tournamentID, tournamentId]);

  const handleNotificationSettingsChange = async (key: keyof TournamentNotificationSettingsDto) => {
    if (!tournamentID || notificationSettings === null) return;

    const previousSettings = notificationSettings;
    const nextSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };

    try {
      setErrorMsg('');
      appData.showLoader();
      setNotificationSettings(nextSettings);

      const updatedSettings = await patchTournamentNotificationSettings(tournamentID, nextSettings);

      setNotificationSettings(updatedSettings.notificationSettings);
    } catch (e) {
      const message = (e as Error).message;

      setNotificationSettings(previousSettings);
      setErrorMsg(message);
      appData.addToast(message, 'error');
    } finally {
      appData.hideLoader();
    }
  };

  if (!tournamentID || Number.isNaN(tournamentId)) {
    return (
      <article className={styles.page}>
        <p className={styles.errorMsg}>Invalid tournament id</p>
      </article>
    );
  }

  const seasonStart = tournamentData?.season?.start_date || 'undefined';
  const seasonEnd = tournamentData?.season?.end_date || 'undefined';

  return (
    <article className={styles.page}>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.tournament]} />
      {tournamentData !== null && (
        <section className={styles.content}>
          <header className={styles.hero}>
            <div className={styles.titleBlock}>
              <p className={styles.eyebrow}>Tournament</p>
              <h1 className={styles.title}>{tournamentData.name}</h1>
            </div>
            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <span>Matches</span>
                <strong>{tournamentData.matches.length}</strong>
              </div>
              <div className={styles.metaItem}>
                <span>Season</span>
                <strong>
                  {seasonStart && seasonEnd ? `${seasonStart} - ${seasonEnd}` : 'Current'}
                </strong>
              </div>
            </div>
            <div className={tournamentStyles.notificationSettings}>
              <p className={tournamentStyles.notificationTitle}>Notification settings</p>
              <Switcher
                label="Matches score change"
                checked={Boolean(notificationSettings?.notifyMatchScoreChanged)}
                disabled={false}
                onChange={() => handleNotificationSettingsChange('notifyMatchScoreChanged')}
              />
              <Switcher
                label="Matches status change"
                checked={Boolean(notificationSettings?.notifyMatchStatusChanged)}
                disabled={false}
                onChange={() => handleNotificationSettingsChange('notifyMatchStatusChanged')}
              />
            </div>
          </header>
          <div className={styles.tableSection}>
            <TournamentMatchesTable matches={tournamentData.matches} />
          </div>
        </section>
      )}
      {errorMsg !== '' && <p className={styles.errorMsg}>{errorMsg}</p>}
    </article>
  );
};

export default Tournament;
