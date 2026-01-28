import React, { useState } from 'react';

import { checkAccessToken } from '@/function/api/checkAccessToken';
import { checkRefreshToken } from '@/function/api/checkRefreshToken';
import { logout } from '@/function/api/logout';
import { refreshTokens } from '@/function/api/refreshTokens';

const Settings = () => {
  const [error, setError] = useState<string>('');
  const [msg, setMsg] = useState<string>('');

  async function checkAccessTokenWrapper() {
    try {
      setError('');
      setMsg('');
      // const data = await checkAccessToken();
      await checkAccessToken();
      setMsg('Access token is valid');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function checkRefreshTokenWrapper() {
    try {
      setError('');
      setMsg('');
      // const data = await checkAccessToken();
      await checkRefreshToken();
      setMsg('Refresh token is valid');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function refreshTokensWrapper() {
    try {
      setError('');
      setMsg('');
      await refreshTokens();
      setMsg('Tokens refreshed');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function logoutWrapper() {
    try {
      setError('');
      setMsg('');
      await logout();
      setMsg('Logged out');
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <h1>Settings</h1>
      <button onClick={() => checkAccessTokenWrapper()}>Check access token</button>
      <button onClick={() => checkRefreshTokenWrapper()}>Check refresh token</button>
      <button onClick={() => refreshTokensWrapper()}>Refresh tokens</button>
      <button onClick={() => logoutWrapper()}>Log out</button>
      {msg && <p style={{ color: 'greenyellow', fontWeight: 'bold' }}>{msg}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
    </article>
  );
};

export default Settings;
