import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export type VpnStatus = 'active' | 'suspended' | 'banned';

export interface AdminUserListItem {
  id: number;
  email: string;
  nickname: string;
  status: string | null;
  roles: string[];
  vpnStatus: VpnStatus | null;
}

export interface AdminUsersResponse {
  data: AdminUserListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type GetAdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getAdminUsers(params: GetAdminUsersParams = {}): Promise<AdminUsersResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);

  const query = searchParams.toString();

  return await universalFetchRequest(
    `admin/users${query ? `?${query}` : ''}`,
    HTMLRequestMethods.GET,
    {}
  );
}
