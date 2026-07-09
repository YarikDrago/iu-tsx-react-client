import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

interface MeResponse {
  nickname: string;
  userId: number;
  roles: string[];
  email?: string;
}

export async function me(): Promise<MeResponse> {
  return await universalFetchRequest('auth/me', HTMLRequestMethods.GET, {});
}
