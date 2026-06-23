import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export type GetTelegramGroupNotificationSettingsDto = {
  notifyPredictionReminder: boolean;
};

export async function getGroupNotificationSettings(groupId: string | number) {
  return await universalFetchRequest<GetTelegramGroupNotificationSettingsDto>(
    `tournaments/groups/${groupId}/notification-settings`,
    HTMLRequestMethods.GET,
    {}
  );
}
