import React, { useEffect } from 'react';

import './default.scss';

import { observer } from 'mobx-react';

import appData from '@/app.data';
import { me } from '@/function/api/me';
import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import Main from '@/layout/Main/Main';
import AppRoutes from '@/routes/AppRoutes';
import { GlobalLoader } from '@/shared/components/loaders/GlobalLoader/GlobalLoader';

import * as styles from './App.module.scss';

const App = () => {
  useEffect(() => {
    const run = async () => {
      await me()
        .then((data) => {
          appData.changeNickname(data.nickname);
          appData.role = data.roles;
        })
        .catch(() => {
          appData.changeNickname('');
          appData.role = [];
        });
    };

    void run();
  }, []);

  return (
    <article className={styles.app}>
      <Header />
      <Main>
        <AppRoutes />
      </Main>
      <Footer />
      <GlobalLoader />
    </article>
  );
};

export default observer(App);
