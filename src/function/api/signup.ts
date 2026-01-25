import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function signup(email: string, nickname: string, password: string) {
  try {
    const body = {
      email: email,
      nickname: nickname,
      password: password,
    };
    const data = await universalFetchRequest('auth/register', HTMLRequestMethods.POST, body);
    console.log('response:', data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
