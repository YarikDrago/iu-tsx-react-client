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
import { socket } from '@/shared/ws/socket';

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

  useEffect(() => {
    const onConnect = () => {
      console.log('ws connected', socket.id);
    };

    const onLastUpdate = (payload: { lastUpdateAt: string | null }) => {
      console.log('lastUpdateAt:', payload.lastUpdateAt);
    };

    socket.on('connect', onConnect);
    socket.on('lastUpdate', onLastUpdate);

    /* Important: remove subscriptions when unmounting to avoid duplicating event handlers */
    return () => {
      socket.off('connect', onConnect);
      socket.off('lastUpdate', onLastUpdate);
    };
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
