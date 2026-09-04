import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import CopyIcon from '@/assets/icons/copy.svg';
import Cross45Icon from '@/assets/icons/x-45-lg.svg';
import { getAdminAccessToken } from '@/function/api/getAdminAccessToken';
import { logout } from '@/function/api/logout';
import { routes } from '@/routes/routes';
import { USER_ROLES } from '@/shared/constants/userRoles';

import * as styles from './ModalNavigation.module.scss';

interface ModalNavigationProps {
  isOpened: boolean;
  handleClose: () => void;
}

const ModalNavigation = ({ isOpened, handleClose }: ModalNavigationProps) => {
  const navigate = useNavigate();
  const [adminAccessToken, setAdminAccessToken] = useState('');
  const [accessTokenError, setAccessTokenError] = useState('');
  const isAdmin = appData.role.includes(USER_ROLES.Admin);

  const changeWindowSizeVariables = () => {
    if (window.innerWidth > 900) {
      handleClose();
    }
  };

  useEffect(() => {
    changeWindowSizeVariables();
    window.addEventListener('resize', changeWindowSizeVariables);
    return () => window.removeEventListener('resize', changeWindowSizeVariables);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (!isOpened || !isAdmin) {
      setAdminAccessToken('');
      setAccessTokenError('');
      return () => {
        isCancelled = true;
      };
    }

    getAdminAccessToken()
      .then((data) => {
        if (isCancelled) return;
        setAdminAccessToken(data.accessToken);
        setAccessTokenError('');
      })
      .catch((e) => {
        if (isCancelled) return;
        setAdminAccessToken('');
        setAccessTokenError((e as Error).message || 'Access token is unavailable');
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpened, isAdmin]);

  const portalRoot = useMemo(() => {
    return document.getElementById('modal-root') ?? document.body;
  }, []);

  async function logoutWrapper() {
    handleClose();
    await logout();
    navigate('/');
  }

  async function copyAdminAccessToken() {
    if (!adminAccessToken) return;

    try {
      await navigator.clipboard.writeText(adminAccessToken);
      appData.addToast('Access token copied', 'success');
    } catch {
      appData.addToast('Unable to copy access token', 'error');
    }
  }

  const content = (
    <div className={`${styles.modalNavigator} ${isOpened ? '' : styles.isHidden}`}>
      <ul className={styles.list}>
        {appData.nickname === '' ? (
          <>
            <li>
              <Link onClick={handleClose} to={'/login'}>
                Log in
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} to={'/signup'}>
                Sign up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className={styles.userInfo}>
              <p>USER: {appData.nickname}</p>
              <p>Role: {appData.role.join(', ')}</p>
              {isAdmin && (
                <div className={styles.adminAccessToken}>
                  <label htmlFor="admin-access-token">Access token</label>
                  <div className={styles.adminAccessTokenControl}>
                    <input
                      id="admin-access-token"
                      type="text"
                      readOnly={true}
                      value={adminAccessToken || accessTokenError || 'Loading...'}
                    />
                    <button
                      type="button"
                      className="admin"
                      onClick={() => void copyAdminAccessToken()}
                      disabled={!adminAccessToken}
                      aria-label="Copy access token"
                      title="Copy access token"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </div>
              )}
            </li>
            {/*<li>*/}
            {/*  <Link to={'/settings'}>Settings</Link>*/}
            {/*</li>*/}
            <li>
              <Link to={routes.contact.href}>{routes.contact.label}</Link>
            </li>
            <li
              className={styles.button}
              onClick={() => {
                logoutWrapper();
              }}
            >
              Log out
            </li>
          </>
        )}
      </ul>
      <button className={`${styles.closeBtn} text`} onClick={() => handleClose()}>
        <Cross45Icon />
      </button>
    </div>
  );

  return createPortal(content, portalRoot);
};

export default observer(ModalNavigation);
