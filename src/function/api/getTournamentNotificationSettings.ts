import { universalFetchRequest } from '@/function/api/universalFetchRequest';
import { HTMLRequestMethods } from '@/models/htmlRequestMethods';

export type TournamentNotificationSettingsDto = {
  notifyMatchStatusChanged: boolean;
  notifyMatchScoreChanged: boolean;
};

export interface TournamentNotificationSettingsExtendedDto {
  tournamentId: number;
  userId: number;
  notificationSettings: TournamentNotificationSettingsDto;
  updatedAt: string;
}

export async function getTournamentNotificationSettings(tournamentId: string | number) {
  return await universalFetchRequest<TournamentNotificationSettingsExtendedDto>(
    `tournaments/${tournamentId}/notification-settings`,
    HTMLRequestMethods.GET,
    {}
  );
}
