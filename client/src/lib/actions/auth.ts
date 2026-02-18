"use server";
import * as z from "zod";

import { RegisterSchema } from "../schemas/auth";
import { RegisterState, RegisterUserData } from "../types/auth";

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
  } else {
    try {
      return { success: true, email: result.data.email.toLowerCase().trim() };
    } catch (err) {
      console.log("ERROOOR", err);
      return { success: false };
    }
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
  } else {
    const newUser: RegisterUserData = {
      email: result.data.email,
      username: result.data.username,
      password: result.data.password,
    };

    // API call here
    // try {} catch (err) {}
    console.log("Creating user with data:", newUser);

    return { success: true, message: "User created successfully!" };
  }
}
