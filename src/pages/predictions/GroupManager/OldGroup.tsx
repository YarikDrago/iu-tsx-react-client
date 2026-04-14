import React from 'react';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import ResetIcon from '@/assets/icons/arrow-clockwise.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import PersonMinusIcon from '@/assets/icons/person-dash-fill.svg';
import PersonPlusIcon from '@/assets/icons/person-plus-fill.svg';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import * as styles from '@/pages/predictions/GroupManager/GroupManager.module.scss';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';

const OldGroup = () => {
  const store = appData.group;
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showUsers, setShowUsers] = React.useState(false);

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

  async function updateGroupMember(member: GroupMember, status: string) {
    try {
      appData.showLoader();
      setErrorMsg('');
      await universalFetchRequest(
        `tournaments/groups/${store.id}/members/${member.user_id}`,
        HTMLRequestMethods.PATCH,
        { status: status }
      );
      if (status === 'delete') {
        store.members = store.members.filter((m) => m.user_id !== member.user_id);
      } else {
        member.status = status;
      }
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <>
      <h1>Group manager</h1>
      <h3>{store.name}</h3>
      <div className={styles.buttonBar}>
        {/* Main info */}
        <button
          className={showUsers ? '' : styles.active}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUsers(false);
          }}
        >
          Main info
        </button>
        {/* Users */}
        <button
          className={showUsers ? styles.active : ''}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUsers(true);
          }}
        >
          Users
        </button>
      </div>
      {showUsers ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nickname</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {store.members.map((member) => (
              <tr key={member.id}>
                <td>{member.user_id}</td>
                <td>{member.nickname}</td>
                <td>{member.status}</td>
                <td
                  style={{
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  {store.ownerId == member.user_id ? (
                    <p>Owner</p>
                  ) : (
                    <>
                      {member.status !== 'verified' && (
                        <button
                          className={styles.iconButton}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateGroupMember(member, 'verified');
                          }}
                          disabled={member.status === 'verified'}
                        >
                          <PersonPlusIcon />
                        </button>
                      )}
                      {member.status !== 'suspended' && (
                        <button
                          className={styles.iconButton}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateGroupMember(member, 'suspended');
                          }}
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        className={`${styles.iconButton} ${styles.iconButton__error}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateGroupMember(member, 'delete');
                        }}
                      >
                        <PersonMinusIcon />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <div className={styles.paramLine}>
            <h4>Tournament:</h4>
            <p>{store.competition?.name}</p>
          </div>
          <div className={styles.paramLine}>
            <h4>Season:</h4>
            <p>
              {store.season?.start_date} - {store.season?.end_date}
            </p>
          </div>
          <div className={styles.paramLine}>
            <h4 style={{ whiteSpace: 'nowrap' }}>Group name:</h4>
            <input
              type="text"
              className={'underline'}
              style={{ lineHeight: '16px', height: '30px' }}
              placeholder={'group name'}
              value={store.name}
              onChange={(e) => {
                store.name = e.target.value;
              }}
            />
          </div>
          <div className={styles.paramLine}>
            <h4>Invite link: </h4>
            {/* Copy link to clipboard */}
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('invite code:', store.inviteCode);
                navigator.clipboard.writeText(
                  `${process.env.API_URL}/predictions/groups/join/?code=${store.inviteCode}`
                );
                alert('Invite link was copied to clipboard');
              }}
            >
              <CopyIcon />
            </button>
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                changeInviteCode();
              }}
            >
              <ResetIcon />
            </button>
          </div>
          <button
            className={'button primary'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              changeGroupName();
            }}
            disabled={store.name === store.oldName}
          >
            Save
          </button>
          <button
            className={styles.deleteButton}
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
      {errorMsg !== '' && <p className={'errorMsg'}>{errorMsg}</p>}
    </>
  );
};

export default observer(OldGroup);
