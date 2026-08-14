import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import availableTournamentsImage from '@/assets/images/Available_tournaments.png';
import myGroupsImage from '@/assets/images/My_groups.png';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { NavigationCard } from '@/shared/components/NavigationCard/NavigationCard';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './Predictions.module.scss';

const Predictions = () => {
  const { ready } = useRequireAccessToken();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (ready) {
      showAvailable();
    }
  }, [ready]);

  async function showAvailable() {
    try {
      setError('');
      appData.showLoader();
    } catch (e) {
      console.log('error');
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function updateCompetitionsSeasons() {
    try {
      setError('');
      appData.showLoader();
      const data = await universalFetchRequest('tournaments/seasons', HTMLRequestMethods.PATCH, {});
      console.log(data);
    } catch (e) {
      console.log('error');
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function updateCompetitionsMatches() {
    try {
      setError('');
      appData.showLoader();
      const data = await universalFetchRequest('tournaments/matches', HTMLRequestMethods.PATCH, {});
      console.log(data);
    } catch (e) {
      console.log('error');
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <article className={styles.predictions}>
      <Breadcrumbs items={[routes.home, routes.predictions]} />
      {ready ? (
        <div className={styles.content}>
          <div className={styles.cardsBox}>
            <NavigationCard title="My Groups" image={myGroupsImage} to={routes.myGroups.href} />
            <NavigationCard
              title="Available tournaments"
              image={availableTournamentsImage}
              to={routes.availableTournaments.href}
            />
          </div>
          {appData.role.includes('admin') && (
            <div className={styles.adminActions}>
              <button
                className={'admin'}
                onClick={() => {
                  navigate(routes.allApiTournaments.href);
                }}
              >
                Show all API tournaments
              </button>
              <button
                className={'admin'}
                onClick={() => {
                  updateCompetitionsSeasons();
                }}
              >
                Update seasons
              </button>
              <button
                className={'admin'}
                onClick={() => {
                  updateCompetitionsMatches();
                }}
              >
                Update matches
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </article>
  );
};

export default observer(Predictions);
