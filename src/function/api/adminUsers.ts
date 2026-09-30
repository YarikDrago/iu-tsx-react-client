import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

const ADMIN_USERS_API_PATH = 'management/users';

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
    `${ADMIN_USERS_API_PATH}${query ? `?${query}` : ''}`,
    HTMLRequestMethods.GET,
    {}
  );
}

export async function getAvailableAdminRoles(): Promise<string[]> {
  return await universalFetchRequest(
    `${ADMIN_USERS_API_PATH}/available-roles`,
    HTMLRequestMethods.GET,
    {}
  );
}

export async function updateAdminUserRoles(
  userId: number,
  roles: string[]
): Promise<AdminUserListItem> {
  return await universalFetchRequest(
    `${ADMIN_USERS_API_PATH}/${userId}/roles`,
    HTMLRequestMethods.PUT,
    { roles }
  );
}
