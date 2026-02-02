import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

interface MeResponse {
  nickname: string;
  roles: string[];
}

export async function me(): Promise<MeResponse> {
  return await universalFetchRequest('auth/me', HTMLRequestMethods.GET, {});
}
