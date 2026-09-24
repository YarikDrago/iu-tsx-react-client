export const USER_ROLES = {
  Admin: 'admin',
  Tester: 'tester',
  VpnUser: 'vpn_user',
  VpnAdmin: 'vpn_admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
