import React from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import * as styles from '@/pages/predictions/GroupManager/GroupManager.module.scss';

const OldGroup = () => {
  const store = appData.group;
  const [errorMsg, setErrorMsg] = React.useState('');

  async function changeGroupName() {
    try {
      setErrorMsg('');
      appData.showLoader();
      const response = await universalFetchRequest(
        `tournaments/groups/${store.id}`,
        HTMLRequestMethods.PATCH,
        {
          name: store.name,
        }
      );
      console.log(response);
      window.location.reload();
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function deleteGroup() {
    try {
      appData.showLoader();
      setErrorMsg('');
      await universalFetchRequest(`tournaments/groups/${store.id}`, HTMLRequestMethods.DELETE, {});
      window.location.reload();
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function changeInviteCode() {
    try {
      appData.showLoader();
      setErrorMsg('');
      await universalFetchRequest(
        `tournaments/groups/${store.id}/invite-code`,
        HTMLRequestMethods.PATCH,
        {}
      );
      window.location.reload();
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <>
      <h1>Group manager</h1>
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
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('invite code:', store.inviteCode);
            navigator.clipboard.writeText(
              `${process.env.BASE_URL}/predictions/groups/join/?code=${store.inviteCode}`
            );
            alert('Invite link was copied to clipboard');
          }}
        >
          Invite link
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            changeInviteCode();
          }}
        >
          Change invite code
        </button>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          changeGroupName();
        }}
        disabled={store.name === store.oldName}
      >
        Change name
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteGroup();
        }}
      >
        Delete group
      </button>
      {errorMsg !== '' && <p className={styles.error}>{errorMsg}</p>}
    </>
  );
};

export default observer(OldGroup);
