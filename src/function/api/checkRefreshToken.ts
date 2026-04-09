import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function checkRefreshToken() {
  try {
    const data = await universalFetchRequest(
      'auth/check-refresh-token',
      HTMLRequestMethods.GET,
      {}
    );
    console.log('refresh token is active');
    return data;
  } catch (e) {
    console.error('refresh token check:', e);
    throw e;
  }
}
