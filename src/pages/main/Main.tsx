import React from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import stadiumImage from '@/assets/images/stadium_s.jpg';

import * as styles from './main.module.scss';

const Main = () => {
  const navigate = useNavigate();

  return (
    <article className={styles.main}>
      {appData.nickname && (
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
      )}
    </article>
  );
};

export default observer(Main);
