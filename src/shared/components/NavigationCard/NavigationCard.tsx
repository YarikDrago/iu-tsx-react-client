import React from 'react';
import { Link } from 'react-router';

import * as styles from './NavigationCard.module.scss';

interface NavigationCardProps {
  title: string;
  to: string;
  image?: string;
  isDisplaed?: boolean;
  /** Apply a special admin style */
  forAdmin?: boolean;
}

export const NavigationCard = ({
  title,
  image,
  to,
  isDisplaed = true,
  forAdmin = false,
}: NavigationCardProps) => {
  if (!isDisplaed) return null;
  return (
    <Link
      className={`${styles.card} ${forAdmin ? styles.forAdmin : ''}`}
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
