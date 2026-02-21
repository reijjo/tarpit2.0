import { ApiResponse } from "./apiResponse";

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
