import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

import appData from '@/app.data';
import { getAvailablePredictions } from '@/function/api/predictions/getAvailablePredictions';
import AvailablePredictionTable from '@/pages/predictions/components/availablePredictionTable/AvailablePredictionTable';
import { Competition } from '@/pages/predictions/models/competition.dto';
import { FootballCompetitionApi } from '@/pages/predictions/models/football_api.dto';
import * as styles from '@/pages/predictions/Predictions.module.scss';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

type ShowMode = 'start' | 'available';

const AvailableTournaments = () => {
  const { ready } = useRequireAccessToken();
  const [showMode, setShowMode] = useState<ShowMode>('start');
  const [tournaments, setTournaments] = useState<Competition[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!ready) return;
    showAvailable();
  }, [ready]);

  async function showAvailable() {
    try {
      console.log('showAvailable');
      setShowMode('start');
      setError('');
      appData.showLoader();
      const data = await getAvailablePredictions();
      setTournaments(data);
      setShowMode('available');
    } catch (e) {
      console.log('error');
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <article>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.availableTournaments]} />
      {showMode === 'available' && (
        <>
          <div
            style={{ paddingLeft: '20px', gap: '10px', display: 'flex', flexDirection: 'column' }}
          >
            <h2>Available Tournaments</h2>
            <p>Select a tournament and create your own group to play!</p>
            <Link
              className={'button'}
              style={{ width: 'fit-content', padding: '10px' }}
              to={routes.myGroups.href}
            >
              See my groups
            </Link>
          </div>
          <AvailablePredictionTable data={tournaments} />
        </>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </article>
  );
};

export default AvailableTournaments;
