import React from 'react';
import { Link, useLocation } from 'react-router';

import * as styles from './Navigation.module.scss';

export const LINK_LIST = [
  {
    path: '/',
    label: 'MAIN',
  },
  {
    path: '/tanks-exp',
    label: 'TANK EXPERIENCE',
  },
];

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();

  return (
    <ul className={`${styles.navigation} ${className ? className : ''}`}>
      {LINK_LIST.map((link, id) => {
        return (
          <li key={id}>
            <Link to={link.path} className={link.path === location.pathname ? styles.selected : ''}>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Navigation;
