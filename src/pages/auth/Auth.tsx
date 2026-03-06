import React from 'react';

import AuthForm from '@/shared/components/authForm/AuthForm';

const Auth = ({ isRegistration = false }: { isRegistration?: boolean }) => {
  return (
    <article
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AuthForm isRegistration={isRegistration} />
    </article>
  );
};

export default Auth;
