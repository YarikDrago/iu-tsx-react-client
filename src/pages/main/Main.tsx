import React from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

import appData from '@/app.data';

const Main = () => {
  return (
    <article>
      <h1>Main</h1>
      {appData.nickname && (
        <div>
          <Link to={'/predictions'}>Predictions</Link>
        </div>
      )}
    </article>
  );
};

export default observer(Main);
