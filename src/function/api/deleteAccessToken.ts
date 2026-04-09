import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function deleteAccessToken() {
  try {
    await universalFetchRequest('auth/access-token', HTMLRequestMethods.DELETE, {});
  } catch (e) {
    console.error('Delete token:', e);
    throw e;
  }
}
