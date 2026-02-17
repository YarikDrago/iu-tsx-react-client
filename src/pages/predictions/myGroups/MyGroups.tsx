import React, { useEffect } from 'react';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { Competition } from '@/pages/predictions/models/competition.dto';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';
import { Season } from '@/pages/predictions/models/season.dto';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

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

  return (
    <div>
      <p>My Groups</p>
      {errorMsg !== '' && <p>{errorMsg}</p>}
      {groups.length ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Tournament</th>
              <th>Season</th>
              <th>Is owner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{String(group.id)}</td>
                <td>{group.name}</td>
                <td>{group.isOwner ? 'Yes' : 'No'}</td>
                <td>{group.tournament.name}</td>
                <td>
                  {group.season.start_date} - {group.season.end_date}
                </td>
                <td>
                  {group.isOwner ? (
                    <div className={styles.actionBlock}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Manage
                      </button>
                    </div>
                  ) : (
                    <button>Leave</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No groups</p>
      )}
    </div>
  );
};

export default MyGroups;
