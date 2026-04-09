import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function refreshTokens() {
  try {
    const data = await universalFetchRequest(
      'auth/refresh-tokens',
      HTMLRequestMethods.GET,
      {},
      { skipAutoRefresh: true }
    );
    console.log('Tokens successfully refreshed');
    return data;
  } catch (e) {
    console.error('refresh tokens:', e);
    throw e;
  }
}
