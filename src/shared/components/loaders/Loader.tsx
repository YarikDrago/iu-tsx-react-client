import React from 'react';

import * as styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.circle}>
        <div className={styles.dot} />
        <div className={styles.outline} />
      </div>
      <div className={styles.circle}>
        <div className={styles.dot} />
        <div className={styles.outline} />
      </div>
      <div className={styles.circle}>
        <div className={styles.dot} />
        <div className={styles.outline} />
      </div>
      <div className={styles.circle}>
        <div className={styles.dot} />
        <div className={styles.outline} />
      </div>
    </div>
  );
};

export default Loader;
