import React from 'react';

import * as styles from './Navigation.module.scss';

interface NavigationProps {
  className?: string;
}

const Navigation = ({ className }: NavigationProps) => {
  return (
    <ul className={`${styles.navigation} ${className ? className : ''}`}>
      <li>Something</li>
    </ul>
  );
};

export default Navigation;
