import React from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';

import * as styles from './main.module.scss';

const Main = () => {
  return (
    <article className={styles.main}>
      {appData.nickname && (
        <div>
          <Link to={'/predictions'}>Predictions</Link>
        </div>
      )}
    </article>
  );
};

export default observer(Main);
