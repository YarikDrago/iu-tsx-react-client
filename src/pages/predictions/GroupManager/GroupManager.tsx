import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

import * as styles from './GroupManager.module.scss';

const GroupManager = () => {
  const store = appData.group;
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successCreation, setSuccessCreation] = React.useState(false);
  const [availableToCreate, setAvailableToCreate] = React.useState(false);

  useEffect(() => {
    if (store.name.length) {
      setAvailableToCreate(true);
    } else {
      setAvailableToCreate(false);
    }
  }, [store.name]);

  async function createGroup() {
    try {
      console.log('create new group');
      console.log('tournament ID:', store.competition?.id);
      console.log('season ID:', store.competition?.currentSeason.id);
      setErrorMsg('');
      const response = await universalFetchRequest(
        `tournaments/${store.competition?.id}/groups`,
        HTMLRequestMethods.POST,
        {
          name: store.name,
          seasonExternalId: store.competition?.currentSeason.id,
        }
      );
      console.log(response);
      setSuccessCreation(true);
    } catch (e) {
      // TODO change
      console.error(e);
      setErrorMsg((e as Error).message);
    }
  }

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
        {successCreation ? (
          <p className={styles.success}>Group was created successfully</p>
        ) : (
          <>
            <h1>{store.isNew ? 'Create new group' : 'Group manager'}</h1>
            <h3>Tournament: {store.competition?.name}</h3>
            <h3>
              Season: {store.competition?.currentSeason.start_date} -{' '}
              {store.competition?.currentSeason.end_date}
            </h3>
            <p>Group name</p>
            <input
              type="text"
              placeholder={'group name'}
              value={store.name}
              onChange={(e) => {
                store.name = e.target.value;
              }}
            />
            {store.isNew && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  createGroup();
                }}
                disabled={!availableToCreate}
              >
                Create
              </button>
            )}
            {errorMsg !== '' && <p className={styles.error}>{errorMsg}</p>}
          </>
        )}
      </form>
    </div>
  );
};

export default observer(GroupManager);
