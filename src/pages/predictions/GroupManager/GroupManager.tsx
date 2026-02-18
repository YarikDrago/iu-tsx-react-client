import React from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import NewGroup from '@/pages/predictions/GroupManager/NewGroup';
import OldGroup from '@/pages/predictions/GroupManager/OldGroup';

import * as styles from './GroupManager.module.scss';

const GroupManager = () => {
  return (
    <div className={styles.modal}>
      <form className={styles.form}>
        <button
          onClick={() => {
            appData.group.hide();
          }}
        >
          X
        </button>
        {appData.group.isNew ? <NewGroup /> : <OldGroup />}
      </form>
    </div>
  );
};

export default observer(GroupManager);
