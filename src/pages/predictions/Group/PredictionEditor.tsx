import React, { useState } from 'react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

import { TEditPrediction } from './Group';
import * as styles from './PredictionEditor.module.scss';

interface Props {
  editData: TEditPrediction;
  onClose?: () => void;
}

const PredictionEditor = ({ editData, onClose }: Props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [homeScore, setHomeScore] = useState<string>(
    editData.prediction?.home_score?.toString() || ''
  );
  const [awayScore, setAwayScore] = useState<string>(
    editData.prediction?.away_score?.toString() || ''
  );

  async function savePrediction() {
    try {
      setErrorMsg('');
      appData.showLoader();
      await universalFetchRequest(
        `tournaments/groups/${editData.groupId}/predictions`,
        HTMLRequestMethods.POST,
        {
          matchId: editData.match.id,
          homeScore: homeScore,
          awayScore: awayScore,
        }
      );
      console.log('saved');
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <div className={styles.modal}>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: 'darkgray',
        }}
      >
        <div>
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            Close
          </button>
          <h1>Edit prediction</h1>
          <h2>
            {editData.match.away_team} - {editData.match.home_team}
          </h2>
          <h3>{editData.match.start_time}</h3>
          <div>
            <input
              type="number"
              placeholder={'home'}
              value={homeScore}
              onChange={(e) => {
                setHomeScore(e.target.value);
              }}
            />
            <p>-</p>
            <input
              type="number"
              placeholder={'away'}
              value={awayScore}
              onChange={(e) => {
                setAwayScore(e.target.value);
              }}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              savePrediction();
            }}
            disabled={
              isNaN(Number(homeScore)) ||
              isNaN(Number(awayScore)) ||
              Number(homeScore) < 0 ||
              Number(awayScore) < 0
            }
          >
            Save
          </button>
        </div>
        {errorMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMsg}</p>}
      </form>
    </div>
  );
};

export default PredictionEditor;
