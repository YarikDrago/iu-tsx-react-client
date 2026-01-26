import appData from '@/app.data';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

/* For preventing multiple refresh requests from running in parallel */
let refreshInFlight: Promise<void> | null = null;

type UniversalFetchOptions = {
  skipAutoRefresh?: boolean;
};

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

function isJsonResponse(contentType: string | null) {
  return !!contentType && contentType.includes('application/json');
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get('content-type');
  const raw = await response.text();

  if (!raw) return { raw: '', data: null as unknown };

  if (isJsonResponse(contentType)) {
    try {
      return { raw, data: JSON.parse(raw) as unknown };
    } catch {
      return { raw, data: null as unknown };
    }
  }

  return { raw, data: raw as unknown };
}

function getErrorMessage(status: number, statusText: string, payload: unknown) {
  const p = payload as ApiErrorPayload | null;
  const msg = p?.message || p?.error;
  return msg ? `${status} ${msg}` : `${status} ${statusText || 'Request failed'}`;
}

function shouldTryRefresh(response: Response, payload: unknown) {
  if (response.status === 401) return true;

  /* Sometimes backend returns 400/403 with text about access token. */
  const p = payload as ApiErrorPayload | null;
  const msg = (p?.message || p?.error || '').toLowerCase();

  return (
    response.status === 403 ||
    (response.status === 400 &&
      (msg.includes('access') || msg.includes('token') || msg.includes('unauthorized')))
  );
}

async function refreshTokensOnce() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const url = `${process.env.API_URL}/auth/refresh-tokens`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data } = await readResponseBody(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status, response.statusText, data));
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export async function universalFetchRequest<TResponse = unknown>(
  path: string,
  method: HTMLRequestMethods,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  options: UniversalFetchOptions = {}
): Promise<TResponse> {
  const url = `${process.env.API_URL}/${path}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  const init: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  /* Add body to the request if it is not GET or HEAD method */
  if (method !== HTMLRequestMethods.GET && method !== HTMLRequestMethods.HEAD) {
    init.body = JSON.stringify(body);
  }
  /* Add an abort signal to the request if the AbortController is existed */
  if (appData.abortRequestSignal) {
    init.signal = appData.abortRequestSignal.signal;
  }

  const doRequest = async () => {
    const response = await fetch(url, init);
    const { data } = await readResponseBody(response);
    return { response, data };
  };

  try {
    let { response, data } = await doRequest();

    if (!response.ok) {
      if (!options.skipAutoRefresh && shouldTryRefresh(response, data)) {
        await refreshTokensOnce();

        ({ response, data } = await doRequest());

        if (!response.ok) {
          throw new Error(getErrorMessage(response.status, response.statusText, data));
        }

        return data as TResponse;
      }

      throw new Error(getErrorMessage(response.status, response.statusText, data));
    }

    return data as TResponse;
  } catch (e) {
    const err = e as Error;
    throw new Error(err.message);
  }
}
