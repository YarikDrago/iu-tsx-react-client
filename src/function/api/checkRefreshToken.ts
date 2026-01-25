import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function checkRefreshToken() {
  try {
    const data = await universalFetchRequest(
      'auth/check-refresh-token',
      HTMLRequestMethods.GET,
      {}
    );
    console.log('response:', data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
