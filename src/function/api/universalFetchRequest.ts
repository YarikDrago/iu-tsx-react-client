import appData from '@/app.data';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function universalFetchRequest(
  path: string,
  method: HTMLRequestMethods,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
) {
  try {
    const url = `${process.env.API_URL}/${path}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    const init: RequestInit = {
      // TODO change to universal
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
    const response = await fetch(url, init).catch((e) => {
      throw new Error(e);
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${response.status} ${data.message}`);
    }

    return data;
  } catch (e) {
    const err = e as Error;
    throw new Error(err.message);
  }
}
