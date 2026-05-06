import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function deleteTelegramAccount(telegramUserId: number) {
  return await universalFetchRequest(
    `auth/telegram-account/${telegramUserId}`,
    HTMLRequestMethods.DELETE,
    {}
  );
}
