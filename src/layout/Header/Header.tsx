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
      {location.pathname === '/' ? <p>Portal</p> : <Link to={'/'}>Main</Link>}
      {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <>
          <PersonButton
            onClick={() => {
              console.log('clicked');
              setIsModalOpened(true);
            }}
          />
          <ModalNavigation isOpened={isModalOpened} handleClose={() => setIsModalOpened(false)} />
        </>
      )}
    </header>
  );
};

export default Header;
