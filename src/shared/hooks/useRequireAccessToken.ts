import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import appData from '@/app.data';
import { checkAccessToken } from '@/function/api/checkAccessToken';
import { checkRefreshToken } from '@/function/api/checkRefreshToken';
import { me } from '@/function/api/me';
import { refreshTokens } from '@/function/api/refreshTokens';
import { routes } from '@/routes/routes';

type RequireAccessTokenStatus = 'checking' | 'ready' | 'redirecting' | 'error';

export function useRequireAccessToken() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState<RequireAccessTokenStatus>('checking');
  const [error, setError] = useState<string | null>(null);

  const ready = status === 'ready';

  useEffect(() => {
    let cancelled = false;
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    const loginRedirectState = { from: returnTo };

    (async () => {
      try {
        setError(null);
        setStatus('checking');

        try {
          await checkAccessToken();
          if (!cancelled) setStatus('ready');
          return;
        } catch {
          console.error('Access token check was failed.');
        }

        try {
          await checkRefreshToken();
        } catch {
          console.error('Refresh token check was failed.');
          if (!cancelled) {
            setStatus('redirecting');
            navigate(`${routes.login.href}`, { replace: true, state: loginRedirectState });
          }
          return;
        }

        await refreshTokens();
        /* Make a simple request to check tokens and get data about the user */
        await me()
          .then((data) => {
            appData.changeNickname(data.nickname);
            appData.changeUserId(data.userId);
            appData.role = data.roles;
          })
          .catch(() => {
            appData.changeNickname('');
            appData.role = [];
          });
        if (!cancelled) setStatus('ready');
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setStatus('error');
          navigate(`${routes.login.href}`, { replace: true, state: loginRedirectState });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.hash, location.pathname, location.search, navigate]);

  return { ready, status, error };
}
