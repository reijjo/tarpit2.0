import { config } from "../utils/envConfig";

import type { RegisterState, RegisterUserData } from "../types/auth";

export const createUser = async (
  credentials: RegisterUserData,
): Promise<RegisterState> => {
  try {
    const res = await fetch(`${config.BACKEND_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return data;
  } catch (err) {
    console.error("Error: ", err);
    return { success: false, error: "Network error" };
  }
};
