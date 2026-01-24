import React from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import PersonIcon from '@/assets/images/person-1.svg';

import * as styles from './PersonButton.module.scss';

interface Props {
  onClick?: () => void;
}

const PersonButton = ({ onClick }: Props) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {appData.nickname ? (
        <p>{appData.nickname.substring(0, 2).toUpperCase()}</p>
      ) : (
        <PersonIcon width={30} height={30} className={styles.icon} />
      )}
    </button>
  );
};

export default observer(PersonButton);
