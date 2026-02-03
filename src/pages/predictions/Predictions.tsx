import React, { useState } from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { getAvailablePredictions } from '@/function/api/predictions/getAvailablePredictions';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import AvailablePredictionTable from '@/pages/predictions/AvailablePredictionTable';
import { FootballCompetitionsApi } from '@/pages/predictions/models/models';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './Predictions.module.scss';

export interface Predictions {
  name: string;
  isActive: boolean;
}

type ShowMode = 'start' | 'available';

const Prediction = () => {
  const [showMode, setShowMode] = useState<ShowMode>('start');
  const [tournaments, setTournaments] = useState<Predictions[]>([]);
  const [error, setError] = useState<string>('');

  useRequireAccessToken();

  async function getCompetitionsApi() {
    try {
      setError('');
      const data = await universalFetchRequest<FootballCompetitionsApi>(
        'tournaments/api',
        HTMLRequestMethods.GET,
        {}
      );
      console.log(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function showAvailable() {
    try {
      setShowMode('start');
      setError('');
      const data = await getAvailablePredictions();
      setTournaments(data);
      setShowMode('available');
    } catch (e) {
      console.log('error');
      setError((e as Error).message);
    }
  }

  return (
    <article className={styles.predictions}>
      <h1>Predictions</h1>
      {appData.role.includes('admin') && (
        <button
          className={'admin'}
          onClick={() => {
            getCompetitionsApi();
          }}
        >
          Show all API tournaments
        </button>
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
    </article>
  );
};

export default observer(Prediction);
