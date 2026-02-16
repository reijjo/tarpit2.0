export type RegisterState = {
  errors?: {
    email?: string[];
    username?: string[];
    password?: string[];
  };
  success: boolean;
  message?: string;
  email?: string;
  username?: string;
  password?: string;
};

export type RegisterUserData = {
  email: string;
  username: string;
  password: string;
};
