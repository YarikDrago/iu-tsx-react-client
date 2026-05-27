import React from 'react';
import { useParams } from 'react-router';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { MatchDto, MatchStatus } from '@/pages/predictions/models/match.dto';
import { Season } from '@/pages/predictions/models/season.dto';
import {
  getAwayTeamResultClass,
  getHomeTeamResultClass,
} from '@/pages/predictions/pages/Group/utils/getTeamResultClass';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from '../Group/Group.module.scss';

interface TournamentData {
  id: number;
  external_id: number;
  name: string;
  season?: Season;
  matches: MatchDto[];
}

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
  const [tournamentData, setTournamentData] = React.useState<TournamentData | null>(null);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (!ready || !tournamentID || Number.isNaN(tournamentId)) return;

    const getTournament = async () => {
      try {
        appData.showLoader();
        setErrorMsg('');

        const data = await universalFetchRequest<TournamentData>(
          `tournaments/${tournamentID}/matches`,
          HTMLRequestMethods.GET,
          {}
        );
        setTournamentData(data);
      } catch (e) {
        setErrorMsg((e as Error).message);
      } finally {
        appData.hideLoader();
      }
    };

    getTournament();
  }, [ready, tournamentID, tournamentId]);

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
