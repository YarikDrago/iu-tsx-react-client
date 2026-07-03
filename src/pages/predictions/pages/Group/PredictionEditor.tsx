import React, { useState } from 'react';

import appData from '@/app.data';
import unknownCrest from '@/assets/icons/unknown_crest.png';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { getAwayTeamName, getHomeTeamName, TeamDto } from '@/pages/predictions/models/match.dto';
import { TEditPrediction } from '@/pages/predictions/pages/Group/models/models';
import CloseBtn from '@/shared/components/buttons/CloseBtn/CloseBtn';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from './PredictionEditor.module.scss';

interface Props {
  editData: TEditPrediction;
  onClose?: () => void;
}

const TeamLabel = ({ name, teamEntity }: { name: string; teamEntity: TeamDto | null }) => {
  return (
    <span className={styles.teamLabel}>
      <img
        alt=""
        className={styles.teamCrest}
        src={teamEntity?.crest || unknownCrest}
        onError={(event) => {
          event.currentTarget.src = unknownCrest;
        }}
      />
      <span>{name}</span>
    </span>
  );
};

const PredictionEditor = ({ editData, onClose }: Props) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [homeScore, setHomeScore] = useState<string>(
    editData.prediction?.home_score?.toString() || '0'
  );
  const [awayScore, setAwayScore] = useState<string>(
    editData.prediction?.away_score?.toString() || '0'
  );
  const homeTeamName = getHomeTeamName(editData.match);
  const awayTeamName = getAwayTeamName(editData.match);

  const changeScore = (
    score: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    delta: number
  ) => {
    const currentScore = Number(score);
    const nextScore = Number.isNaN(currentScore) ? 0 : Math.max(0, currentScore + delta);

    setter(String(nextScore));
  };

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
            <h1 className={styles.eyebrow}>Edit prediction</h1>
            <p className={styles.matchTime}>
              {`Time: ${formatLocalDDMMYY_HHMM(editData.match.start_time, false)}`}
            </p>
          </div>
          <div className={styles.inputBlock}>
            <div className={styles.scoreField}>
              <TeamLabel name={homeTeamName} teamEntity={editData.match.home_team_entity} />
              <div className={styles.scoreInputControl}>
                <button
                  type="button"
                  className={styles.scoreStepper}
                  onClick={() => changeScore(homeScore, setHomeScore, -1)}
                  disabled={Number(homeScore) <= 0}
                  aria-label="Decrease home score"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={'0'}
                  aria-label="Home score"
                  value={homeScore}
                  onChange={(e) => {
                    setHomeScore(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className={styles.scoreStepper}
                  onClick={() => changeScore(homeScore, setHomeScore, 1)}
                  aria-label="Increase home score"
                >
                  +
                </button>
              </div>
            </div>
            <p className={styles.scoreSeparator}>-</p>
            <div className={styles.scoreField}>
              <TeamLabel name={awayTeamName} teamEntity={editData.match.away_team_entity} />
              <div className={styles.scoreInputControl}>
                <button
                  type="button"
                  className={styles.scoreStepper}
                  onClick={() => changeScore(awayScore, setAwayScore, -1)}
                  disabled={Number(awayScore) <= 0}
                  aria-label="Decrease away score"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={'0'}
                  aria-label="Away score"
                  value={awayScore}
                  onChange={(e) => {
                    setAwayScore(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className={styles.scoreStepper}
                  onClick={() => changeScore(awayScore, setAwayScore, 1)}
                  aria-label="Increase away score"
                >
                  +
                </button>
              </div>
            </div>
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
