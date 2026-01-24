import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router';

import ModalNavigation from '@/layout/Header/Navigation/Navigation/ModalNavigation';
import PersonButton from '@/layout/Header/PersonButton/PersonButton';

import * as styles from './Header.module.scss';

const Header = () => {
  const location = useLocation();
  const [isModalOpened, setIsModalOpened] = React.useState(false);

  useEffect(() => {
    console.log('location:', location.pathname);
  }, [location.pathname]);

  return (
    <header className={styles.header}>
      {location.pathname !== '/login' && location.pathname !== '/signup' ? (
        <>
          <p>Portal</p>
          <PersonButton
            onClick={() => {
              console.log('clicked');
              setIsModalOpened(true);
            }}
          />
          <ModalNavigation isOpened={isModalOpened} handleClose={() => setIsModalOpened(false)} />
        </>
      ) : (
        <Link to={'/'}>Main</Link>
      )}
    </header>
  );
};

export default Header;
