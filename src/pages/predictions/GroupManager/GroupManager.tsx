import React from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import CloseBtn from '@/shared/components/buttons/CloseBtn/CloseBtn';

import * as styles from './GroupManager.module.scss';
import NewGroup from './NewGroup';
import OldGroup from './OldGroup';

const GroupManager = () => {
  return (
    <div className={styles.modal}>
      <form className={`form`}>
        <CloseBtn
          onClick={() => {
            appData.group.hide();
          }}
        />
        {appData.group.isNew ? <NewGroup /> : <OldGroup />}
      </form>
    </div>
  );
};

export default observer(GroupManager);
