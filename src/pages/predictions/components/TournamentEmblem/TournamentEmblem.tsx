import React from 'react';

import TrophyIcon from '@/assets/icons/trophy.svg';

import * as styles from './TournamentEmblem.module.scss';

interface TournamentEmblemProps {
  emblem?: string | null;
}

export const TournamentEmblem = ({ emblem }: TournamentEmblemProps) => {
  const [hasLoadError, setHasLoadError] = React.useState(false);

  if (!emblem || hasLoadError) {
    return <TrophyIcon className={styles.emblem} aria-hidden="true" />;
  }

  return (
    <img className={styles.emblem} src={emblem} alt="" onError={() => setHasLoadError(true)} />
  );
};
