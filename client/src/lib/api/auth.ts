import { config } from "../utils/envConfig";

import type { RegisterState, RegisterUserData } from "../types/auth";

const AUTH_URL = `${config.BACKEND_URL}/auth`;

// auth/available
// GET
// Check if email/username is available
const checkDuplicateField = async (
  field: "email" | "username",
  value: string,
): Promise<RegisterState> => {
  try {
    const res = await fetch(
      `${AUTH_URL}/available?${field}=${encodeURIComponent(value)}`,
    );
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return { success: false, error: errorBody.error ?? "Request failed" };
    }
    return res.json();
  } catch (err) {
    console.error("Error", err);
    return { success: false, error: "Network error" };
  }
};

export const checkDuplicateEmail = (value: string) =>
  checkDuplicateField("email", value);

export const checkDuplicateUsername = (value: string) =>
  checkDuplicateField("username", value);

// auth/register
// POST
// Create new user
export const createUser = async (
  credentials: RegisterUserData,
): Promise<RegisterState> => {
  try {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error ?? "Request failed." };
    }
    return data;
  } catch (err) {
    console.error("Error: ", err);
    return { success: false, error: "Network error" };
  }
};
