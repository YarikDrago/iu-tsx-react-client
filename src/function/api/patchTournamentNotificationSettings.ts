import {
  TournamentNotificationSettingsDto,
  TournamentNotificationSettingsExtendedDto,
} from '@/function/api/getTournamentNotificationSettings';
import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export async function patchTournamentNotificationSettings(
  tournamentId: string | number,
  notificationSettings: TournamentNotificationSettingsDto
) {
  return await universalFetchRequest<TournamentNotificationSettingsExtendedDto>(
    `tournaments/${tournamentId}/notification-settings`,
    HTMLRequestMethods.PATCH,
    notificationSettings
  );
}
