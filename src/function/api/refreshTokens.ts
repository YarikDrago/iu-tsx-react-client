import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function refreshTokens() {
  try {
    const data = await universalFetchRequest('auth/refresh-tokens', HTMLRequestMethods.GET, {});
    console.log('response:', data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
