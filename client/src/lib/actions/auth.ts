"use server";
import * as z from "zod";

import {
  checkDuplicateEmail,
  checkDuplicateUsername,
  createUser,
  loggingIn,
} from "../api/auth";

import { LoginSchema, RegisterSchema } from "../schemas/auth";
import {
  LoginData,
  LoginState,
  RegisterState,
  RegisterUserData,
} from "../types/auth";

export async function registerEmail(
  _prevState: RegisterState,
  data: FormData,
): Promise<RegisterState> {
  const email = data.get("email");
  const result = RegisterSchema.pick({ email: true }).safeParse({ email });

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);

    return {
      success: false,
      errors: fieldErrors,
    };
  }

  try {
    const checkDuplicate = await checkDuplicateEmail(result.data.email);
    if (!checkDuplicate.success) {
      return {
        success: false,
        errors: {
          email: [checkDuplicate.error ?? "Email already registered"],
        },
      };
    }

    return { success: true, email: result.data.email };
  } catch (error) {
    console.error("Error checking duplicate email:", error);
    return {
      success: false,
      errors: {
        email: ["Could not validate email right now. Please try again."],
      },
    };
  }
}

export async function registerCredentials(
  _prevState: RegisterState,
  data: FormData,
): Promise<RegisterState> {
  const username = data.get("username");
  const password = data.get("password");
  const email = data.get("email");

  const result = RegisterSchema.safeParse({ username, password, email });

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);

    return {
      success: false,
      errors: fieldErrors,
      username: String(username || ""),
      password: "",
    };
  }

  try {
    const checkDuplicate = await checkDuplicateUsername(result.data.username);
    if (!checkDuplicate.success) {
      return {
        success: false,
        errors: {
          username: [checkDuplicate.error ?? "Username already registered"],
        },
        username: result.data.username,
        password: "",
      };
    }

    const newUser: RegisterUserData = {
      email: result.data.email,
      username: result.data.username,
      password: result.data.password,
    };

    const user = await createUser(newUser);
    if (!user.success) {
      return {
        success: false,
        error: user.error ?? "Registration failed. Please try again",
        username: result.data.username,
        password: "",
      };
    }

    return {
      success: true,
      message: user.message ?? "Check your email to validate your account.",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Registration failed. Please try again",
      username: result.data.username,
      password: "",
    };
  }
}

export async function loginUser(
  _prevState: LoginState,
  data: FormData,
): Promise<LoginState> {
  const login = data.get("login");
  const password = data.get("password");

  const result = LoginSchema.safeParse({ login, password });
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);

    return {
      success: false,
      errors: fieldErrors,
      login: String(login || ""),
      password: "",
    };
  }

  try {
    const credentials: LoginData = {
      login: result.data.login,
      password: result.data.password,
    };

    const user = await loggingIn(credentials);
    if (!user.success) {
      return {
        success: false,
        error: user.error ?? "Login failed. Please try again",
        login: result.data.login,
        password: "",
      };
    }

    return {
      success: true,
      message: "Logging you in...",
    };
  } catch (error) {
    console.error("Error logging in: ", error);
    return {
      success: false,
      error: "Login failed. Please try again",
      login: result.data.login,
      password: "",
    };
  }
}
