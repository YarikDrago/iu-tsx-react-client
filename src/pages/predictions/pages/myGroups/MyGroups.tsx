import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

import appData from '@/app.data';
import ClipboardPlusIcon from '@/assets/icons/clipboard2-plus.svg';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { Competition } from '@/pages/predictions/models/competition.dto';
import { Group } from '@/pages/predictions/models/group.dto';
import { GroupMember, GroupMemberStatus } from '@/pages/predictions/models/groupMember.dto';
import { Season } from '@/pages/predictions/models/season.dto';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';
import { formatLocalDDMMYY_HHMM } from '@/shared/utils/formatLocalDDMMYY_HHMM';

import * as styles from './MyGroups.module.scss';

export interface GroupSummary {
  id: number;
  name: string;
  isOwner: boolean;
  createdAt: string;
  inviteCode: string;
  tournament: Competition;
  season: Season;
  members: GroupMember[];
}

const MyGroups = () => {
  const { ready } = useRequireAccessToken();
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState<GroupSummary[]>([]);
  const [errorMsg, setErrorMsg] = React.useState('');

  useEffect(() => {
    if (!ready || groups.length) return;
    fetchGroups();
  }, [ready]);

  async function fetchGroups() {
    try {
      appData.showLoader();
      setErrorMsg('');
      const groups = await universalFetchRequest<GroupSummary[]>(
        'tournaments/groups',
        HTMLRequestMethods.GET,
        {}
      );
      setGroups(groups);
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  async function manageGroup(group: GroupSummary) {
    try {
      setErrorMsg('');
      appData.showLoader();
      // TODO download Competition of current group and save it to prevent reloading from DB

      const groupInfo = await universalFetchRequest<Group>(
        `tournaments/groups/${group.id}`,
        HTMLRequestMethods.GET,
        {}
      );

      const notificationSettings = await universalFetchRequest(
        `tournaments/groups/${group.id}/notification-settings`,
        HTMLRequestMethods.GET,
        {}
      );
      console.log(groupInfo);
      console.log('notification settings:', notificationSettings);

      appData.group.show({
        isNew: false,
        id: groupInfo.id,
        oldName: groupInfo.name,
        name: groupInfo.name,
        competition: groupInfo.tournament,
        season: groupInfo.season,
        inviteCode: groupInfo.inviteCode,
        members: groupInfo.members,
        ownerId: groupInfo.ownerId,
      });
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  function openMatches(groupId: number) {
    navigate(`/predictions/groups/${groupId}`);
  }

  async function leaveGroup(groupId: number) {
    try {
      setErrorMsg('');
      appData.showLoader();
      await universalFetchRequest(
        `tournaments/groups/${groupId}/members/${appData.userId}`,
        HTMLRequestMethods.PATCH,
        {
          status: GroupMemberStatus.Left,
        }
      );
      await fetchGroups();
    } catch (e) {
      setErrorMsg((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }

  return (
    <article>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.myGroups]} />
      {errorMsg !== '' && <p>{errorMsg}</p>}
      {groups.length ? (
        <section className={styles.groupsTableSection}>
          <div className={styles.groupsTableContent}>
            <div className={styles.tableActions}>
              <Link
                className={`button ${styles.createGroupButton}`}
                to={routes.availableTournaments.href}
              >
                <ClipboardPlusIcon
                  className={styles.createGroupIcon}
                  aria-hidden="true"
                  focusable="false"
                />
                Create new group
              </Link>
            </div>
            <div className={`tableWrapper ${styles.tableWrapper}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {/*<th>ID</th>*/}
                    <th>Name</th>
                    <th>Tournament</th>
                    <th>Season</th>
                    {/*<th>Is owner</th>*/}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr
                      onClick={() => {
                        openMatches(group.id);
                      }}
                      key={group.id}
                    >
                      {/*<td>{String(group.id)}</td>*/}
                      <td data-label="Name">{group.name}</td>
                      <td data-label="Tournament">{group.tournament.name}</td>
                      <td data-label="Season">
                        {formatLocalDDMMYY_HHMM(group.season.start_date)} -{' '}
                        {formatLocalDDMMYY_HHMM(group.season.end_date)}{' '}
                      </td>
                      {/*<td>{group.isOwner ? 'Yes' : 'No'}</td>*/}
                      {/* Action */}
                      <td className={styles.action} data-label="Action">
                        <div className={styles.actionBlock}>
                          <button
                            className={'tableButtonPrimary'}
                            onClick={(e) => {
                              e.stopPropagation();
                              openMatches(group.id);
                            }}
                          >
                            Matches
                          </button>
                          {group.isOwner ? (
                            <button
                              className={'tableButtonPrimary'}
                              onClick={(e) => {
                                e.stopPropagation();
                                manageGroup(group);
                              }}
                            >
                              Manage
                            </button>
                          ) : (
                            <button
                              className={'tableButtonDanger'}
                              onClick={(e) => {
                                e.stopPropagation();
                                leaveGroup(group.id);
                              }}
                            >
                              Leave
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <p>No groups</p>
      )}
    </article>
  );
};

export default MyGroups;
