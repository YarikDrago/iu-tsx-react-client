import { GetTelegramGroupNotificationSettingsDto } from '@/function/api/getGroupNotificationSettings';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function patchGroupNotificationSettings(
  groupId: string | number,
  notificationSettings: GetTelegramGroupNotificationSettingsDto
) {
  return await universalFetchRequest<GetTelegramGroupNotificationSettingsDto>(
    `tournaments/groups/${groupId}/notification-settings`,
    HTMLRequestMethods.PATCH,
    notificationSettings
  );
}
