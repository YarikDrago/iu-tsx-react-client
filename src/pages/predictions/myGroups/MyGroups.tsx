import React, { useEffect } from 'react';

import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

interface Group {
  id: number;
  name: string;
  isOwner: boolean;
}

const MyGroups = () => {
  const { ready } = useRequireAccessToken();
  const [groups, setGroups] = React.useState<Group[]>([]);

  useEffect(() => {
    if (!ready || groups.length) return;
    fetchGroups();
  }, [ready]);

  async function fetchGroups() {
    const groups = await universalFetchRequest<Group[]>(
      'tournaments/groups',
      HTMLRequestMethods.GET,
      {}
    );

    setGroups(groups);
  }

  return (
    <div>
      <p>My Groups</p>
      {groups.length ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Is owner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>{group.isOwner ? 'Yes' : 'No'}</td>
                <td>{group.isOwner ? <button>Delete</button> : <button>Leave</button>}</td>
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
