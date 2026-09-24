import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { AdminUserListItem, getAdminUsers } from '@/function/api/adminUsers';
import { me } from '@/function/api/me';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { USER_ROLES } from '@/shared/constants/userRoles';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './AdminUsers.module.scss';

const PAGE_SIZE = 20;

const AdminUsers = () => {
  const navigate = useNavigate();
  const { ready: tokenReady } = useRequireAccessToken();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tokenReady) return;

    let cancelled = false;

    const checkRole = async () => {
      try {
        const currentUser = await me();
        const canViewUsers =
          currentUser.roles.includes(USER_ROLES.Admin) ||
          currentUser.roles.includes(USER_ROLES.VpnAdmin);

        if (cancelled) return;

        appData.changeNickname(currentUser.nickname);
        appData.changeUserId(currentUser.userId);
        appData.changeEmail(currentUser.email ?? '');
        appData.role = currentUser.roles;

        if (!canViewUsers) {
          navigate(routes.home.href, { replace: true });
          return;
        }

        setIsAuthorized(true);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    };

    void checkRole();

    return () => {
      cancelled = true;
    };
  }, [navigate, tokenReady]);

  const loadUsers = useCallback(async () => {
    try {
      setError('');
      appData.showLoader();
      const response = await getAdminUsers({ page, limit: PAGE_SIZE, search });
      setUsers(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      appData.hideLoader();
    }
  }, [page, search]);

  useEffect(() => {
    if (!isAuthorized) return;
    void loadUsers();
  }, [isAuthorized, loadUsers]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  if (!isAuthorized && !error) return null;

  return (
    <article className={styles.usersPage}>
      <Breadcrumbs items={[routes.home, routes.adminUsers]} />

      <header className={styles.header}>
        <div>
          <h1>Users</h1>
          <p>{total} accounts</p>
        </div>

        <form className={styles.search} onSubmit={handleSearch}>
          <label htmlFor="admin-users-search">Search users</label>
          <div className={styles.searchControls}>
            <input
              id="admin-users-search"
              type="search"
              value={searchInput}
              maxLength={255}
              placeholder="Email or nickname"
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="submit" className="admin">
              Search
            </button>
            {search && (
              <button type="button" className="secondary" onClick={handleClearSearch}>
                Clear
              </button>
            )}
          </div>
        </form>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {!error &&
        (users.length === 0 ? (
          <p className={styles.empty}>No users found.</p>
        ) : (
          <div className={styles.tableViewport}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Account status</th>
                  <th>Roles</th>
                  <th>VPN status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div className={styles.identity}>
                        <strong>{user.nickname}</strong>
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.status}>{user.status ?? 'Unknown'}</span>
                    </td>
                    <td>
                      <div className={styles.roles}>
                        {user.roles.length > 0
                          ? user.roles.map((role) => <span key={role}>{role}</span>)
                          : 'No roles'}
                      </div>
                    </td>
                    <td>
                      <span className={styles.status}>{user.vpnStatus ?? 'Not created'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {!error && totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Users pagination">
          <button
            type="button"
            className="secondary"
            disabled={page <= 1}
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </article>
  );
};

export default observer(AdminUsers);
