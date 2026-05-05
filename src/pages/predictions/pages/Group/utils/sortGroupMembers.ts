import appData from '@/app.data';
import { GroupMember } from '@/pages/predictions/models/groupMember.dto';

export const sortGroupMembers = (members: GroupMember[]) => {
  return [...members].sort((a, b) => {
    if (a.user_id === appData.userId && b.user_id !== appData.userId) return -1;
    if (b.user_id === appData.userId && a.user_id !== appData.userId) return 1;

    return a.nickname.localeCompare(b.nickname);
  });
};
