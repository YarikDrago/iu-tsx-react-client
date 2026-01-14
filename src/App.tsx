import React from 'react';

import './default.scss';

import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import Main from '@/layout/Main/Main';
import AppRoutes from '@/routes/AppRoutes';

import * as styles from './App.module.scss';

const App = () => {
  return (
    <article className={styles.app}>
      <Header />
      <Main>
        <AppRoutes />
      </Main>
      <Footer />
    </article>
  );
};

export default App;
