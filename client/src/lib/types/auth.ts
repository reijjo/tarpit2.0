import { ApiResponse } from "./apiResponse";

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
  token?: string;
};

export type LoginData = {
  login: string;
  password: string;
};
