import React, { useState } from 'react';

import appData from '@/app.data';
import { patchTournamentMatch } from '@/function/api/patchTournamentMatch';
import { MatchDto } from '@/pages/predictions/models/match.dto';
import CloseBtn from '@/shared/components/buttons/CloseBtn/CloseBtn';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from './PredictionEditor.module.scss';

interface Props {
  match: MatchDto;
  onClose?: () => void;
  onSaved: (match: MatchDto) => void;
}

const toScoreInputValue = (score: number | null) => {
  return score === null ? '' : String(score);
};

const toScorePayloadValue = (score: string) => {
  return score === '' ? null : Number(score);
};

const isScoreInvalid = (score: string) => {
  if (score === '') return false;

  const value = Number(score);

  return Number.isNaN(value) || value < 0 || !Number.isInteger(value);
};

const MatchScoreEditor = ({ match, onClose, onSaved }: Props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [homeScore, setHomeScore] = useState<string>(toScoreInputValue(match.home_score));
  const [awayScore, setAwayScore] = useState<string>(toScoreInputValue(match.away_score));
  const [isHomeScoreNull, setIsHomeScoreNull] = useState(match.home_score === null);
  const [isAwayScoreNull, setIsAwayScoreNull] = useState(match.away_score === null);

  async function saveScore() {
    const nextHomeScore = isHomeScoreNull ? null : toScorePayloadValue(homeScore);
    const nextAwayScore = isAwayScoreNull ? null : toScorePayloadValue(awayScore);

    try {
      setErrorMsg('');
      appData.showLoader();

      const updatedMatch = await patchTournamentMatch(match.id, {
        homeScore: nextHomeScore,
        awayScore: nextAwayScore,
      });

      onSaved({
        ...match,
        ...updatedMatch,
        home_score: updatedMatch?.home_score ?? nextHomeScore,
        away_score: updatedMatch?.away_score ?? nextAwayScore,
      });
      appData.addToast('Match score saved', 'success');
      if (onClose) onClose();
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <div className={styles.modal}>
      <form className={`form ${styles.form} admin`}>
        <div className={styles.cardContent}>
          <CloseBtn
            type="button"
            className={styles.closeButton}
            onClick={() => {
              if (onClose) onClose();
            }}
          />
          <div className={styles.header}>
            <p className={styles.eyebrow}>Edit match score</p>
            <h1 className={styles.matchTitle}>
              {match.home_team || '???'} - {match.away_team || '???'}
            </h1>
            <p className={styles.matchTime}>
              {`Time: ${formatLocalDDMMYY_HHMM(match.start_time, false) || 'scheduled'}`}
            </p>
          </div>
          <div className={styles.inputBlock}>
            <label className={styles.scoreField}>
              <span>Home</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder={'0'}
                disabled={isHomeScoreNull}
                value={homeScore}
                onChange={(e) => {
                  setHomeScore(e.target.value);
                }}
              />
              <label className={styles.nullCheckbox}>
                <input
                  type="checkbox"
                  checked={isHomeScoreNull}
                  onChange={(e) => {
                    setIsHomeScoreNull(e.target.checked);
                  }}
                />
                <span>Set null</span>
              </label>
            </label>
            <p className={styles.scoreSeparator}>-</p>
            <label className={styles.scoreField}>
              <span>Away</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder={'0'}
                disabled={isAwayScoreNull}
                value={awayScore}
                onChange={(e) => {
                  setAwayScore(e.target.value);
                }}
              />
              <label className={styles.nullCheckbox}>
                <input
                  type="checkbox"
                  checked={isAwayScoreNull}
                  onChange={(e) => {
                    setIsAwayScoreNull(e.target.checked);
                  }}
                />
                <span>Set null</span>
              </label>
            </label>
          </div>
          <button
            className={'primary'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              saveScore();
            }}
            disabled={
              (!isHomeScoreNull && isScoreInvalid(homeScore)) ||
              (!isAwayScoreNull && isScoreInvalid(awayScore))
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

export default MatchScoreEditor;
