import React from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { getTournamentData, TournamentDataDto } from '@/function/api/getTournamentData';
import {
  getTournamentNotificationSettings,
  TournamentNotificationSettingsDto,
} from '@/function/api/getTournamentNotificationSettings';
import { patchTournamentMatch } from '@/function/api/patchTournamentMatch';
import { patchTournamentNotificationSettings } from '@/function/api/patchTournamentNotificationSettings';
import {
  getAwayTeamName,
  getHomeTeamName,
  MatchDto,
  MatchStatus,
} from '@/pages/predictions/models/match.dto';
import MatchScoreEditor from '@/pages/predictions/pages/Group/MatchScoreEditor';
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

interface TournamentMatchesTableProps {
  matches: MatchDto[];
  onEditMatchScore: (match: MatchDto) => void;
  onHidePredictionsChange: (match: MatchDto, hidePredictions: boolean) => void;
  onManualUpdateChange: (match: MatchDto, manualUpdate: boolean) => void;
}

const TournamentMatchesTable = ({
  matches,
  onEditMatchScore,
  onHidePredictionsChange,
  onManualUpdateChange,
}: TournamentMatchesTableProps) => {
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
            {appData.role.includes('admin') && <th className={'admin'}>Hide predictions</th>}
            {appData.role.includes('admin') && <th className={'admin'}>Manual update</th>}
          </tr>
        </thead>
        <tbody>
          {matches.map((match, idx) => (
            <tr
              key={match.id}
              ref={match.id === initialScrollTargetMatchId ? initialScrollTargetRef : null}
            >
              <td>{idx + 1}</td>
              <td className={getHomeTeamResultClass(match)}>{getHomeTeamName(match)}</td>
              <td className={getAwayTeamResultClass(match)}>{getAwayTeamName(match)}</td>
              <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                {formatLocalDDMMYY_HHMM(match.start_time, false) || 'scheduled'}
              </td>
              <td className={match.status === MatchStatus.FINISHED ? styles.finished : ''}>
                {match.status}
              </td>
              <td className={styles.scoreCell}>
                <p>{`${String(match.home_score)} - ${String(match.away_score)}`}</p>
                {appData.role.includes('admin') && (
                  <button
                    className={'admin'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMatchScore(match);
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
              {appData.role.includes('admin') && (
                <td className={'admin'}>
                  <input
                    type="checkbox"
                    checked={match.hide_predictions}
                    onChange={(e) => {
                      e.stopPropagation();
                      onHidePredictionsChange(match, e.target.checked);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </td>
              )}
              {appData.role.includes('admin') && (
                <td className={'admin'}>
                  <input
                    type="checkbox"
                    checked={match.manualUpdate}
                    onChange={(e) => {
                      e.stopPropagation();
                      onManualUpdateChange(match, e.target.checked);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </td>
              )}
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
  const [editMatchScore, setEditMatchScore] = React.useState<MatchDto | null>(null);
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

  const handleMatchScoreSaved = React.useCallback((updatedMatch: MatchDto) => {
    setTournamentData((prevData) => {
      if (prevData === null) return prevData;

      return {
        ...prevData,
        matches: prevData.matches.map((match) =>
          match.id === updatedMatch.id ? updatedMatch : match
        ),
      };
    });
  }, []);

  const handleHidePredictionsChange = React.useCallback(
    async (match: MatchDto, hidePredictions: boolean) => {
      try {
        setErrorMsg('');
        appData.showLoader();

        const updatedMatch = await patchTournamentMatch(match.id, {
          hide_predictions: hidePredictions,
        });

        const nextMatch = {
          ...match,
          ...updatedMatch,
          hide_predictions: updatedMatch?.hide_predictions ?? hidePredictions,
        };

        setTournamentData((prevData) => {
          if (prevData === null) return prevData;

          return {
            ...prevData,
            matches: prevData.matches.map((item) => (item.id === match.id ? nextMatch : item)),
          };
        });
        appData.addToast('Hide predictions status saved', 'success');
      } catch (e) {
        const message = (e as Error).message;

        setErrorMsg(message);
        appData.addToast(message, 'error');
      } finally {
        appData.hideLoader();
      }
    },
    []
  );

  const handleManualUpdateChange = React.useCallback(
    async (match: MatchDto, manualUpdate: boolean) => {
      try {
        setErrorMsg('');
        appData.showLoader();

        const updatedMatch = await patchTournamentMatch(match.id, {
          manualUpdate,
        });

        const nextMatch = {
          ...match,
          ...updatedMatch,
          manualUpdate: updatedMatch?.manualUpdate ?? manualUpdate,
        };

        setTournamentData((prevData) => {
          if (prevData === null) return prevData;

          return {
            ...prevData,
            matches: prevData.matches.map((item) => (item.id === match.id ? nextMatch : item)),
          };
        });
        appData.addToast('Manual update status saved', 'success');
      } catch (e) {
        const message = (e as Error).message;

        setErrorMsg(message);
        appData.addToast(message, 'error');
      } finally {
        appData.hideLoader();
      }
    },
    []
  );

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
            {appData.role.includes('admin') && (
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
            )}
          </header>
          <div className={styles.tableSection}>
            <TournamentMatchesTable
              matches={tournamentData.matches}
              onEditMatchScore={setEditMatchScore}
              onHidePredictionsChange={handleHidePredictionsChange}
              onManualUpdateChange={handleManualUpdateChange}
            />
          </div>
        </section>
      )}
      {errorMsg !== '' && <p className={styles.errorMsg}>{errorMsg}</p>}
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

export default observer(Tournament);
