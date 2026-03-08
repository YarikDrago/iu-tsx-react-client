import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import Cross45Icon from '@/assets/icons/x-45-lg.svg';
import { logout } from '@/function/api/logout';

import * as styles from './ModalNavigation.module.scss';

interface ModalNavigationProps {
  isOpened: boolean;
  handleClose: () => void;
}

const ModalNavigation = ({ isOpened, handleClose }: ModalNavigationProps) => {
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

  const portalRoot = useMemo(() => {
    return document.getElementById('modal-root') ?? document.body;
  }, []);

  async function logoutWrapper() {
    handleClose();
    await logout();
  }

  const content = (
    <div className={`${styles.modalNavigator} ${isOpened ? '' : styles.isHidden}`}>
      <ul className={styles.list}>
        {appData.nickname === '' ? (
          <>
            <li>
              <Link to={'/login'}>Log in</Link>
            </li>
            <li>
              <Link to={'/signup'}>Sign up</Link>
            </li>
          </>
        ) : (
          <>
            <li>USER: {appData.nickname}</li>
            <li>Role: {appData.role.join(', ')}</li>
            <li>
              <Link to={'/settings'}>Settings</Link>
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
      <button className={styles.closeBtn} onClick={() => handleClose()}>
        <Cross45Icon />
      </button>
    </div>
  );

  return createPortal(content, portalRoot);
};

export default observer(ModalNavigation);
