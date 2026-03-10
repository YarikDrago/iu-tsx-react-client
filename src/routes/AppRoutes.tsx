import React from 'react';
import { Route, Routes } from 'react-router';

import { ActivateAsync } from '@/pages/activate/Activate.async';
import { AuthAsync } from '@/pages/auth/Auth.async';
import { MainAsync } from '@/pages/main/index.async';
import { ApiCompetitionMatchesAsync } from '@/pages/predictions/ApiCompetitionMatches';
import { GroupAsync } from '@/pages/predictions/Group';
import { PredictionsAsync } from '@/pages/predictions/index.async';
import { JoinToGroupAsync } from '@/pages/predictions/JoinToGroup/index.async';
import { MyGroupsAsync } from '@/pages/predictions/myGroups/index.async';
import { ResetPasswordAsync } from '@/pages/resetPassword';
import { SettingsAsync } from '@/pages/settings/index.async';
import { routes } from '@/routes/routes';

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={routes.signUp.href} element={<AuthAsync isRegistration={true} />} />
        <Route path={routes.login.href} element={<AuthAsync />} />
        <Route path={routes.activate.href} element={<ActivateAsync />} />
        <Route path={routes.resetPassword.href} element={<ResetPasswordAsync />} />
        <Route path={routes.settings.href} element={<SettingsAsync />} />
        <Route path={routes.predictions.href} element={<PredictionsAsync />} />
        <Route path={routes.apiCompetition.href} element={<ApiCompetitionMatchesAsync />} />
        <Route path={routes.myGroups.href} element={<MyGroupsAsync />} />
        <Route path={routes.group.href} element={<GroupAsync />} />
        <Route path={routes.joinGroup.href} element={<JoinToGroupAsync />} />
        <Route path={routes.home.href} element={<MainAsync />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
