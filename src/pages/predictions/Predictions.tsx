import React, { useState } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { getAvailablePredictions } from '@/function/api/predictions/getAvailablePredictions';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import AllApiTournaments from '@/pages/predictions/allApiTournaments/AllApiTournaments';
import AvailablePredictionTable from '@/pages/predictions/AvailablePredictionTable';
import { Competition } from '@/pages/predictions/models/competition.models';
import {
  FootballCompetitionApi,
  FootballCompetitionsApi,
} from '@/pages/predictions/models/football_api.models';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './Predictions.module.scss';

type ShowMode = 'start' | 'available';

const Predictions = () => {
  const [showMode, setShowMode] = useState<ShowMode>('start');
  const [tournaments, setTournaments] = useState<Competition[]>([]);
  const [error, setError] = useState<string>('');
  const [competitions, setCompetitions] = useState<FootballCompetitionApi[] | null>(null);

  useRequireAccessToken();

  async function getCompetitionsApi() {
    try {
      setCompetitions(null);
      setError('');
      appData.showLoader();
      const data = await universalFetchRequest<FootballCompetitionsApi>(
        'tournaments/api',
        HTMLRequestMethods.GET,
        {}
      );
      setCompetitions(data.competitions);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function showAvailable() {
    try {
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
      <h1>Predictions</h1>
      <Link to={'/predictions/groups'}>My Groups</Link>
      {appData.role.includes('admin') && (
        <>
          <button
            className={'admin'}
            onClick={() => {
              getCompetitionsApi();
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
        </>
      )}
      <button
        onClick={() => {
          showAvailable();
        }}
      >
        Show available
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {showMode === 'available' && <AvailablePredictionTable data={tournaments} />}
      {competitions && <AllApiTournaments competitions={competitions} />}
    </article>
  );
};

export default observer(Predictions);
