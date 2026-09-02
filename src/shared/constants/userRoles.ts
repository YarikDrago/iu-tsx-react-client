export const USER_ROLES = {
  Admin: 'admin',
  Tester: 'tester',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
