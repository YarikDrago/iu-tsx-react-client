import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';
import { me } from '@/function/api/me';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';
import AllApiTournaments from '@/pages/predictions/components/allApiTournaments/AllApiTournaments';
import {
  FootballCompetitionApi,
  FootballCompetitionsApi,
} from '@/pages/predictions/models/football_api.dto';
import { routes } from '@/routes/routes';
import { Breadcrumbs } from '@/shared/components/Breadcrumbs/Breadcrumbs';
import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

import * as styles from './AllApiTournamentsPage.module.scss';

const AllApiTournamentsPage = () => {
  const { ready } = useRequireAccessToken();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [competitionsApi, setCompetitionsApi] = useState<FootballCompetitionApi[] | null>(null);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function loadApiTournaments() {
      try {
        setCompetitionsApi(null);
        setError('');
        appData.showLoader();

        const user = await me();
        appData.changeNickname(user.nickname);
        appData.changeUserId(user.userId);
        appData.changeEmail(user.email ?? '');
        appData.role = user.roles;

        if (!user.roles.includes('admin')) {
          navigate(routes.predictions.href, { replace: true });
          return;
        }

        const data = await universalFetchRequest<FootballCompetitionsApi>(
          'tournaments/api',
          HTMLRequestMethods.GET,
          {}
        );

        if (!cancelled) {
          setCompetitionsApi(data.competitions);
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
        }
      } finally {
        appData.hideLoader();
      }
    }

    void loadApiTournaments();

    return () => {
      cancelled = true;
    };
  }, [navigate, ready]);

  return (
    <article className={styles.page}>
      <Breadcrumbs items={[routes.home, routes.predictions, routes.allApiTournaments]} />
      {!ready && <p>Loading...</p>}
      {ready && error && <p className={styles.error}>{error}</p>}
      {ready && competitionsApi && <AllApiTournaments competitions={competitionsApi} />}
    </article>
  );
};

export default observer(AllApiTournamentsPage);
