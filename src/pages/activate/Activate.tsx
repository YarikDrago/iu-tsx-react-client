import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { activate } from '@/function/api/activate';

const Activate = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    activate(token || '')
      .then((res) => {
        console.log('activation successful');
        console.log('Res:', res);
        setSuccess(true);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {success && (
        <>
          <h3>Activation successfully completed!</h3>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Activate;
