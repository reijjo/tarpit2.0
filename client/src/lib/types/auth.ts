export type RegisterState = {
  errors?: {
    email?: string[];
    username?: string[];
    password?: string[];
  };
  success: boolean;
  message?: string;
  email?: string;
};
