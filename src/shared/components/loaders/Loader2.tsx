import React from 'react';

import * as styles from './Loader2.module.scss';

const Loader2 = () => {
  return (
    <div
      className={styles.loader}
      style={{
        transform: 'scale(0.4)',
      }}
    />
  );
};

export default Loader2;
