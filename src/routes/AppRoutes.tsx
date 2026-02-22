import React from 'react';
import { Route, Routes } from 'react-router';

import { ActivateAsync } from '@/pages/activate/Activate.async';
import { AuthAsync } from '@/pages/auth/Auth.async';
import { MainAsync } from '@/pages/main/index.async';
import { ApiCompetitionMatchesAsync } from '@/pages/predictions/ApiCompetitionMatches';
import { PredictionsAsync } from '@/pages/predictions/index.async';
import { JoinToGroupAsync } from '@/pages/predictions/JoinToGroup/index.async';
import { MyGroupsAsync } from '@/pages/predictions/myGroups/index.async';
import { ResetPasswordAsync } from '@/pages/resetPassword';
import { SettingsAsync } from '@/pages/settings/index.async';

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={'/signup'} element={<AuthAsync isRegistration={true} />} />
        <Route path={'/login'} element={<AuthAsync />} />
        <Route path={'/activate/:token'} element={<ActivateAsync />} />
        <Route path={'/reset-password/:token'} element={<ResetPasswordAsync />} />
        <Route path={'/settings'} element={<SettingsAsync />} />
        <Route path={'/predictions'} element={<PredictionsAsync />} />
        <Route path={'/predictions/competition/:id'} element={<ApiCompetitionMatchesAsync />} />
        <Route path={'/predictions/groups'} element={<MyGroupsAsync />} />
        <Route path={'/predictions/groups/join/'} element={<JoinToGroupAsync />} />
        <Route path={'/'} element={<MainAsync />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
