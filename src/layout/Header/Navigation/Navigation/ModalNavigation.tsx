import React, { useEffect } from 'react';
import { Link } from 'react-router';

import Cross45Icon from '@/assets/icons/x-45-lg.svg';
import { LINK_LIST } from '@/layout/Header/Navigation/Navigation/Navigation';

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

  return (
    <div className={`${styles.modalNavigator} ${isOpened ? '' : styles.isHidden}`}>
      <ul className={styles.list}>
        {LINK_LIST.map((link, id) => {
          return (
            <li key={id}>
              <Link
                to={link.path}
                className={link.path === location.pathname ? styles.selected : ''}
                onClick={() => handleClose()}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button className={styles.closeBtn} onClick={() => handleClose()}>
        <Cross45Icon />
      </button>
    </div>
  );
};

export default ModalNavigation;
