import React from 'react';

import bg from '@/assets/images/background.jpg';

import * as styles from './Main.module.scss';

const style = {
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

interface MainProps {
  children?: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
  return (
    <main className={styles.main} style={style}>
      {children}
    </main>
  );
};

export default Main;
