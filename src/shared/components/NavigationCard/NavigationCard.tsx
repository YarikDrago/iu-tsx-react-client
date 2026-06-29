import React from 'react';
import { Link } from 'react-router';

import * as styles from './NavigationCard.module.scss';

interface NavigationCardProps {
  title: string;
  image: string;
  to: string;
}

export const NavigationCard = ({ title, image, to }: NavigationCardProps) => {
  return (
    <Link
      className={styles.card}
      style={
        {
          ['--card-bg' as any]: `url(${image})`,
        } as React.CSSProperties
      }
      to={to}
    >
      <h1>{title}</h1>
    </Link>
  );
};
