import React, { useEffect } from 'react';
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

  async function logoutWrapper() {
    handleClose();
    await logout();
  }

  return (
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
};

export default observer(ModalNavigation);
