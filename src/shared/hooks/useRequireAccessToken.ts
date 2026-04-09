import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { checkAccessToken } from '@/function/api/checkAccessToken';
import { checkRefreshToken } from '@/function/api/checkRefreshToken';
import { refreshTokens } from '@/function/api/refreshTokens';
import { routes } from '@/routes/routes';

type RequireAccessTokenStatus = 'checking' | 'ready' | 'redirecting' | 'error';

export function useRequireAccessToken() {
  const navigate = useNavigate();

  const [status, setStatus] = useState<RequireAccessTokenStatus>('checking');
  const [error, setError] = useState<string | null>(null);

  const ready = status === 'ready';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        setStatus('checking');

        await checkAccessToken()
          .then(() => {
            if (!cancelled) setStatus('ready');
            return;
          })
          .catch(() => {
            console.error('Access token check was failed.');
          });

        if (status === 'ready') return;

        await checkRefreshToken().catch(() => {
          console.error('Refresh token check was failed.');
          setStatus('redirecting');
          navigate(`${routes.login.href}`, { replace: true });
          return;
        });

        await refreshTokens();
        if (!cancelled) setStatus('ready');
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { ready, status, error };
}
