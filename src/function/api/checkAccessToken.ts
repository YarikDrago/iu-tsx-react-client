import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function checkAccessToken() {
  try {
    const data = await universalFetchRequest('auth/check-access-token', HTMLRequestMethods.GET, {});
    console.log('response:', data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
