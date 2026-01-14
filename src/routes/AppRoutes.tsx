import React from 'react';
import { Route, Routes } from 'react-router';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={'/'} element={<div>Home</div>} />
    </Routes>
  );
};

export default AppRoutes;
