import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function activate(token: string) {
  try {
    const body = {
      token: token,
    };

    const data = await universalFetchRequest('auth/activate', HTMLRequestMethods.POST, body);

    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
