import React from 'react';

import { useRequireAccessToken } from '@/shared/hooks/useRequireAccessToken';

const Prediction = () => {
  useRequireAccessToken();

  return (
    <div>
      <h1>Predictions</h1>
    </div>
  );
};

export default Prediction;
