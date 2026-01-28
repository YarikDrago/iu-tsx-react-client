import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { checkAccessToken } from '@/function/api/checkAccessToken';

type Options = {
  redirectTo?: string;
};

export function useRequireAccessToken(options: Options = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = options.redirectTo ?? '/login';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await checkAccessToken();

        if (typeof res === 'object' && res && 'valid' in (res as Record<string, unknown>)) {
          const valid = (res as { valid: boolean }).valid;
          if (!valid && !cancelled) {
            navigate(redirectTo, { replace: true, state: { from: location.pathname } });
          }
        }
      } catch {
        if (!cancelled) {
          console.log('Error while checking access token');
          navigate(redirectTo, { replace: true, state: { from: location.pathname } });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, location.pathname, redirectTo]);
}
