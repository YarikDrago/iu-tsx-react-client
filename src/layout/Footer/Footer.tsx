import React from 'react';
import { Link } from 'react-router';

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
      </nav>
      <IULogo width={50} height={50} />
      <div className={styles.line}>
        <p>2026, Iaroslav Uliantsev</p>
      </div>
    </footer>
  );
};

export default Footer;
