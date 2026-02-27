import { type UserRoleType } from "./enums";

export type Token = {
  token: string;
  expiresAt: Date;
  userId: number;
  user: User;
};

export type User = {
  id: number;
  email: string;
  username: string;
  password: string;
  verified: boolean;
  role: UserRoleType;
  token: Token;
};

export type UserSafe = Omit<User, "password" | "token">;
