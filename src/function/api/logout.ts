import Cookies from 'js-cookie';

import appData from '@/app.data';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function logout() {
  try {
    const data = await universalFetchRequest(
      'auth/logout',
      HTMLRequestMethods.POST,
      {},
      { skipAutoRefresh: true }
    );

    console.log('response:', data);
    // TODO create enum for cookies
    Cookies.remove('user_id');
    Cookies.remove('nickname');
    appData.changeNickname('');
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
