import React, { useEffect } from 'react';

import './default.scss';

import { observer } from 'mobx-react';

import appData from '@/app.data';
import bg from '@/assets/images/background.jpg';
import { checkHealth } from '@/function/api/checkHealth';
import { me } from '@/function/api/me';
import Footer from '@/layout/Footer/Footer';
import Header from '@/layout/Header/Header';
import Main from '@/layout/Main/Main';
import GroupManager from '@/pages/predictions/components/GroupManager/GroupManager';
import AppRoutes from '@/routes/AppRoutes';
import { GlobalLoader } from '@/shared/components/loaders/GlobalLoader/GlobalLoader';
import { socket } from '@/shared/ws/socket';

import * as styles from './App.module.scss';

import './shared/styles/form.scss';
import './shared/styles/msg.scss';
import './shared/styles/button.scss';
import './shared/styles/toast.scss';
import './shared/styles/input.scss';

import { ToastsContainer } from '@/shared/components/ToastsContainer/ToastsContainer';

const style = {
  ['--app-bg' as never]: `url(${bg})`,
} as React.CSSProperties;

const App = () => {
  useEffect(() => {
    let hasActiveHealthError = false;
    let isDisposed = false;

    const run = async () => {
      try {
        const health = await checkHealth();

        if (isDisposed) return;

        if (health.status !== 'ok' || health.database !== 'up') {
          throw new Error('Server or database is unavailable');
        }

        hasActiveHealthError = false;
      } catch (e) {
        /* Anti spam condition */
        if (isDisposed || hasActiveHealthError) return;
        const err = e as Error;
        appData.addToast(err.message, 'error', 30000);
        console.error(err.message);
        hasActiveHealthError = true;
      }
    };

    void run();
    const intervalId = window.setInterval(() => void run(), 30_000);

    return () => {
      isDisposed = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      await me()
        .then((data) => {
          appData.changeNickname(data.nickname);
          appData.changeUserId(data.userId);
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

    const onConnectError = (err: Error) => {
      console.error('WS connect error:', err.message);
      appData.addToast(`WS connection error: ${err.message}`, 'error');
    };

    const onLastUpdate = (payload: { lastUpdateAt: string | null }) => {
      console.log('lastUpdateAt:', payload.lastUpdateAt);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('lastUpdate', onLastUpdate);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('lastUpdate', onLastUpdate);
      socket.disconnect();
    };
  }, []);

  return (
    <article className={styles.app} style={style}>
      <Header />
      <Main>
        <AppRoutes />
      </Main>
      <Footer />
      <div id={'modal-root'}></div>
      {appData.group.isVisible && <GroupManager />}
      <ToastsContainer toasts={appData.toasts} onClose={appData.onCloseToast} />
      <GlobalLoader />
    </article>
  );
};

export default observer(App);
