"use server";
import * as z from "zod";

import { checkDuplicateEmail } from "../api/auth";
import { createUser } from "../api/user";

import { RegisterSchema } from "../schemas/auth";
import { RegisterState, RegisterUserData } from "../types/auth";

export async function registerEmail(
  _prevState: RegisterState,
  data: FormData,
): Promise<RegisterState> {
  const email = data.get("email");

  const result = RegisterSchema.pick({ email: true }).safeParse({ email });

  console.log("result", result);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);

    return {
      success: false,
      errors: fieldErrors,
    };
  } else {
    try {
      const checkDuplicate = await checkDuplicateEmail(result.data.email);
      console.log("checkduplicate", checkDuplicate);
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

    try {
      const user = await createUser(newUser);
      return { success: true, message: user.message };
    } catch (err) {
      console.log("ERROOOR", err);
      return { success: false };
    }
  }
}
