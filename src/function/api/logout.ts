import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function logout() {
  try {
    const data = await universalFetchRequest('auth/logout', HTMLRequestMethods.POST, {});

    console.log('response:', data);
    appData.nickname = '';
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
