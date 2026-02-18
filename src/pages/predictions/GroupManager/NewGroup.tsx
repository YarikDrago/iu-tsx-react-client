import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import * as styles from '@/pages/predictions/GroupManager/GroupManager.module.scss';

const NewGroup = () => {
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
      console.log('season ID:', store.season?.external_id);
      setErrorMsg('');
      const response = await universalFetchRequest(
        `tournaments/${store.competition?.id}/groups`,
        HTMLRequestMethods.POST,
        {
          name: store.name,
          seasonExternalId: store.season?.external_id,
        }
      );
      console.log(response);
      setSuccessCreation(true);
      window.location.reload();
    } catch (e) {
      // TODO change
      console.error(e);
      setErrorMsg((e as Error).message);
    }
  }

  if (successCreation) {
    return <p>Group was created successfully</p>;
  }

  return (
    <>
      <h1>Create new group</h1>
      <h3>Tournament: {store.competition?.name}</h3>
      <h3>
        Season: {store.season?.start_date} - {store.season?.end_date}
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
      <button
        onClick={(e) => {
          e.preventDefault();
          createGroup();
        }}
        disabled={!availableToCreate}
      >
        Create
      </button>
      {errorMsg !== '' && <p className={styles.error}>{errorMsg}</p>}
    </>
  );
};

export default observer(NewGroup);
