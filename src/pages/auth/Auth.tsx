import React from 'react';

import AuthForm from '@/shared/components/authForm/AuthForm';

const Auth = ({ isRegistration = false }: { isRegistration?: boolean }) => {
  return (
    <article
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <AuthForm isRegistration={isRegistration} />
    </article>
  );
};

export default Auth;
