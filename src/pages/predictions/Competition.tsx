import React, { useState } from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { getAvailablePredictions } from '@/function/api/predictions/getAvailablePredictions';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import AllApiTournaments from '@/pages/predictions/allApiTournaments/AllApiTournaments';
import AvailablePredictionTable from '@/pages/predictions/AvailablePredictionTable';
import { FootballCompetitionApi, FootballCompetitionsApi } from '@/pages/predictions/models/models';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './Predictions.module.scss';

export interface Competition {
  id: number;
  external_id: number;
  name: string;
  isObservable: boolean; // true
  currentSeason: {
    id: string;
    external_id: string;
    tournament_id: number;
    start_date: string;
    end_date: string;
    isCurrent: boolean; // true
    created_at: Date;
    updated_at: Date;
  };
}

type ShowMode = 'start' | 'available';

const Prediction = () => {
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

export default observer(Prediction);
