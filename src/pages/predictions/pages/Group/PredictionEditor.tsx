import React, { useState } from 'react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { TEditPrediction } from '@/pages/predictions/pages/Group/models/models';
import CloseBtn from '@/shared/components/buttons/CloseBtn/CloseBtn';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from './PredictionEditor.module.scss';

interface Props {
  editData: TEditPrediction;
  onClose?: () => void;
}

const PredictionEditor = ({ editData, onClose }: Props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [homeScore, setHomeScore] = useState<string>(
    editData.prediction?.home_score?.toString() || '0'
  );
  const [awayScore, setAwayScore] = useState<string>(
    editData.prediction?.away_score?.toString() || '0'
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
      appData.addToast('Prediction saved', 'success');
      if (onClose) onClose();
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <div className={styles.modal}>
      <form className={`form ${styles.form}`}>
        <div className={styles.cardContent}>
          <CloseBtn
            type="button"
            className={styles.closeButton}
            onClick={() => {
              if (onClose) onClose();
            }}
          />
          <div className={styles.header}>
            <p className={styles.eyebrow}>Edit prediction</p>
            <h1 className={styles.matchTitle}>
              {editData.match.home_team} - {editData.match.away_team}
            </h1>
            <p className={styles.matchTime}>
              {`Time: ${formatLocalDDMMYY_HHMM(editData.match.start_time, false)}`}
            </p>
          </div>
          <div className={styles.inputBlock}>
            <label className={styles.scoreField}>
              <span>Home</span>
              <input
                type="number"
                placeholder={'0'}
                value={homeScore}
                onChange={(e) => {
                  setHomeScore(e.target.value);
                }}
              />
            </label>
            <p className={styles.scoreSeparator}>-</p>
            <label className={styles.scoreField}>
              <span>Away</span>
              <input
                type="number"
                placeholder={'0'}
                value={awayScore}
                onChange={(e) => {
                  setAwayScore(e.target.value);
                }}
              />
            </label>
          </div>
          <button
            className={'primary'}
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
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
      </form>
    </div>
  );
};

export default PredictionEditor;
