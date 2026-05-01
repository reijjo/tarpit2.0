// ----------------------------
// --- Login Actions ---
import z from "zod";

import { loggingIn } from "../api/auth";

import { LoginSchema } from "../schemas/auth";
import { LoginState, LoginData } from "../types/auth";

// ----------------------------
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
      login: String(login ?? ""),
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
