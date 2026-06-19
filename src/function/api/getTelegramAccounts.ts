import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export type GetTelegramAccountsResponse = {
  id: string;
  userId: string;
  telegramUserId: string;
  chatId: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  linkedAt: string;
};

export async function getTelegramAccounts() {
  return await universalFetchRequest<GetTelegramAccountsResponse[]>(
    'auth/telegram-account',
    HTMLRequestMethods.GET,
    {}
  );
}
