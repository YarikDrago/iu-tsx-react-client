import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

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
      appData.showLoader();
      checkName(store.name);
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
      console.error(e);
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  function checkName(name: string) {
    if (name.length < 3) {
      throw new Error('Group name must be at least 3 characters long');
    }
    if (name.length > 20) {
      throw new Error('Group name must be at most 20 characters long');
    }
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      throw new Error('Group name must contain only letters and numbers');
    }
    return true;
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
          setErrorMsg('');
          store.name = e.target.value;
        }}
      />
      <button
        className={'primary'}
        onClick={(e) => {
          e.preventDefault();
          createGroup();
        }}
        disabled={!availableToCreate}
      >
        <p>Create</p>
      </button>
      {errorMsg !== '' && <p className={'errorMsg'}>{errorMsg}</p>}
    </>
  );
};

export default observer(NewGroup);
