import React from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import welcomePredictionFootball from '@/assets/images/football_main.png';
import stadiumImage from '@/assets/images/stadium_s.jpg';
import { NavigationCard } from '@/shared/components/NavigationCard/NavigationCard';

import * as styles from './main.module.scss';

const Main = () => {
  const navigate = useNavigate();

  return (
    <article className={styles.main}>
      {appData.nickname ? (
        <div className={styles.cardsBox}>
          <NavigationCard title="Prediction games" image={stadiumImage} to={'/predictions'} />
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
