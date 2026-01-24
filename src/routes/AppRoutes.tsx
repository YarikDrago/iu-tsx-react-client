import React from 'react';
import { Route, Routes } from 'react-router';

import { ActivateAsync } from '@/pages/activate/Activate.async';
import { AuthAsync } from '@/pages/auth/Auth.async';
import { MainAsync } from '@/pages/main/index.async';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={'/signup'} element={<AuthAsync isRegistration={true} />} />
      <Route path={'/login'} element={<AuthAsync />} />
      <Route path={'/activate/:token'} element={<ActivateAsync />} />
      <Route path={'/'} element={<MainAsync />} />
    </Routes>
  );
};

export default AppRoutes;
