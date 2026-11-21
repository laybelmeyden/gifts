export const USER_ROLES = ['user', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
