import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function login(password: string, email: string) {
  try {
    const body = {
      email: email,
      password: password,
    };

    const data = await universalFetchRequest('auth/login', HTMLRequestMethods.POST, body);

    console.log('response:', data);
    console.log('log end');

    return data;
  } catch (e) {
    console.log('error');
    // TODO
    console.log(e);
    throw e;
  }
}
