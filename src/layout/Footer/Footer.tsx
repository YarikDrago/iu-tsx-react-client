import React from 'react';

import IULogo from '@/assets/images/logo-IU.svg';

import * as styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <IULogo width={50} height={50} />
      <div className={styles.line}>
        <p>2026, Iaroslav Uliantsev</p>
      </div>
    </footer>
  );
};

export default Footer;
