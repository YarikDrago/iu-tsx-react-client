import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

interface AdminAccessTokenResponse {
  accessToken: string;
}

export async function getAdminAccessToken(): Promise<AdminAccessTokenResponse> {
  return await universalFetchRequest<AdminAccessTokenResponse>(
    'auth/admin-access-token',
    HTMLRequestMethods.GET,
    {}
  );
}
