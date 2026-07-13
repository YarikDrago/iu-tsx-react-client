import React from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import IULogo from '@/assets/images/logo-IU.svg';
import { routes } from '@/routes/routes';

import * as styles from './Footer.module.scss';

const footerLinks = [routes.contact];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links} aria-label="Service links">
        {footerLinks.map((link) => (
          <Link key={link.href} className={styles.link} to={link.href}>
            {link.label}
          </Link>
        ))}
        {appData.role.includes('admin') && (
          <Link className={`button admin ${styles.adminLink}`} to={routes.privacy.href}>
            {routes.privacy.label}
          </Link>
        )}
      </nav>
      <IULogo width={50} height={50} />
      <div className={styles.line}>
        <p>2026, Iaroslav Uliantsev</p>
      </div>
    </footer>
  );
};

export default observer(Footer);
