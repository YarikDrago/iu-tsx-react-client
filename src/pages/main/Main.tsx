import React from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import welcomePredictionFootball from '@/assets/images/football_main.png';
import stadiumImage from '@/assets/images/stadium_s.jpg';

import * as styles from './main.module.scss';

const Main = () => {
  const navigate = useNavigate();

  return (
    <article className={styles.main}>
      {appData.nickname ? (
        <div className={styles.cardsBox}>
          <div
            className={styles.card}
            style={
              {
                ['--card-bg' as any]: `url(${stadiumImage})`,
              } as React.CSSProperties
            }
            onClick={() => {
              navigate('/predictions');
            }}
          >
            <h1>Prediction games</h1>
          </div>
        </div>
      ) : (
        <div>
          {/* Get started today card*/}
          <div className={`${styles.welcome} ${styles.block}`}>
            <div className={styles.content}>
              <div className={styles.contentText}>
                <h1>Get started today</h1>
                <p>Sign up now to start your game and compete with other players.</p>
                <button
                  className={'primary'}
                  onClick={() => {
                    navigate('/signup');
                  }}
                >
                  Sign up
                </button>
              </div>
              <div className={styles.contentImage}>
                <img src={welcomePredictionFootball} alt="Football prediction" />
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default observer(Main);
