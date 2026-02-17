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
            {store.isNew ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  createGroup();
                }}
                disabled={!availableToCreate}
              >
                Create
              </button>
            ) : (
              <>
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
              </>
            )}
            {errorMsg !== '' && <p className={styles.error}>{errorMsg}</p>}
          </>
        )}
      </form>
    </div>
  );
};

export default observer(GroupManager);
