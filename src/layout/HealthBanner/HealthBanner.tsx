import { observer } from 'mobx-react';

import appData from '@/app.data';

import * as styles from './HealthBanner.module.scss';

const HealthBanner = () => {
  if (appData.healthStatus !== 'error') return null;

  return (
    <section className={styles.banner} role="alert" aria-live="assertive">
      <div className={styles.content}>
        <p className={styles.title}>Service temporarily unavailable</p>
        <p className={styles.message}>{appData.healthMessage}</p>
      </div>
    </section>
  );
};

export default observer(HealthBanner);
