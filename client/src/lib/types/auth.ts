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

type RegisterFieldName = "email" | "username" | "password";
type RegisterFieldType = "email" | "text" | "password";

export type RegisterField = {
  name: RegisterFieldName;
  type: RegisterFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
  defaultValue?: string;
};

export type RegisterUserData = {
  email: string;
  username: string;
  password: string;
};
