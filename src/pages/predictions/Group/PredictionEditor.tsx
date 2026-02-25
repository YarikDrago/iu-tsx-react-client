import React, { useState } from 'react';

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
            <input type="number" placeholder={'home'} value={homeScore} />
            <p>-</p>
            <input type="number" placeholder={'away'} value={awayScore} />
          </div>
          <button>Save</button>
        </div>
        {errorMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMsg}</p>}
      </form>
    </div>
  );
};

export default PredictionEditor;
