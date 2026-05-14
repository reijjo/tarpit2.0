import { ApiResponse } from "@/lib/types/apiResponse";
import { z } from "zod";

export const userRoleSchema = z.enum(["GUEST", "PAID", "BOSS"]);
export type UserRole = z.infer<typeof userRoleSchema>;

// Register
export type RegisterState = ApiResponse & {
  errors?: {
    email?: string[];
    username?: string[];
    password?: string[];
  };
  email?: string;
  username?: string;
  password?: string;
};

export type RegisterUserData = {
  email: string;
  username: string;
  password: string;
};

// Login
export type LoginState = ApiResponse & {
  errors?: {
    login?: string[];
    password?: string[];
  };
  login?: string;
  password?: string;
};

export type LoginData = {
  login: string;
  password: string;
};
