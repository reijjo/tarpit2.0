import { config } from "../utils/envConfig";

import type { RegisterState } from "../types/auth";

export const checkDuplicateEmail = async (
  value: string,
): Promise<RegisterState> => {
  try {
    const res = await fetch(
      `${config.BACKEND_URL}/users/find?email=${encodeURIComponent(value)}`,
    );
    return res.json();
  } catch (err) {
    console.error("Error", err);
    return { success: false, message: "Network error" };
  }
};

export const checkDuplicateUsername = async (
  value: string,
): Promise<RegisterState> => {
  try {
    const res = await fetch(
      `${config.BACKEND_URL}/users/find?username=${encodeURIComponent(value)}`,
    );
    return res.json();
  } catch (err) {
    console.error("Error", err);
    return { success: false, message: "Network error" };
  }
};
