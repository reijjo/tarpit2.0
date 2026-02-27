export const UserRole = {
  GUEST: "GUEST",
  PAID: "PAID",
  BOSS: "BOSS",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
