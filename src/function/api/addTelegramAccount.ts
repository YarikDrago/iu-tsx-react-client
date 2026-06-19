import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export interface UserTelegramAccountDto {
  telegramUserId: number;
  chatId?: number | null;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export type PostUserTelegramAccountResponse = UserTelegramAccountDto & {
  id?: number;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function addTelegramAccount(dto: UserTelegramAccountDto) {
  return await universalFetchRequest<PostUserTelegramAccountResponse>(
    'auth/telegram-account',
    HTMLRequestMethods.POST,
    dto
  );
}
