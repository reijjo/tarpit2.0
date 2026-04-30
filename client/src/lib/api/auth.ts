import { ApiResponse } from "../types/apiResponse";

import { config } from "../utils/envConfig";

import type {
  LoginData,
  LoginState,
  RegisterState,
  RegisterUserData,
} from "../types/auth";

const AUTH_URL = `${config.BACKEND_URL}/api/auth`;

// ----------------------------
// --- /api/auth/available ---
// ----------------------------

// api/auth/available - query: email or username
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

// ----------------------------
// --- /api/auth/register ---
// ----------------------------

// api/auth/register - body: { email, username, password }
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

// ----------------------------
// --- /api/auth/login ---
// ----------------------------

// api/auth/login - body: { username, password }
// POST
// Log in
export const loggingIn = async (
  credentials: LoginData,
): Promise<ApiResponse<LoginState>> => {
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
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

// ----------------------------
// --- api/auth/verify ---
// ----------------------------

// api/auth/verify - params: token
// GET
// Verify email with token
export const verifyAccount = async (token: string): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `${AUTH_URL}/verify?token=${encodeURIComponent(token)}`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error ?? "Verification request failed.",
        status: res.status,
      };
    }

    return data;
  } catch (err) {
    console.error("Error: ", err);
    return { success: false, error: "Network error" };
  }
};

// api/auth/verify - body: token
// POST
// Create new verification token and send email
export const resendVerificationEmailRequest = async (
  token: string,
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${AUTH_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error ?? "Resend request failed.",
        status: res.status,
      };
    }

    return data;
  } catch (err) {
    console.error("Error: ", err);
    return { success: false, error: "Network error" };
  }
};

// -------------------
// --- api/auth/me ---
// -------------------

// api/auth/me
// GET
// Checks authorization
// export const getMe = async (): Promise<ApiResponse> => {
//   try {
//     const res = await fetch(`${AUTH_URL}/me`, {
//       method: "GET",
//       credentials: "include",
//       cache: "no-store",
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return {
//         success: false,
//         error: data.error ?? "Unauthorized",
//         status: res.status,
//       };
//     }

//     return data;
//   } catch (err) {
//     console.error("ME ERROR: ", err);
//     return { success: false, error: "Network error" };
//   }
// };

// ------------------------
// --- /api/auth/logout ---
// ------------------------

// api/auth/logout
// POST
// Log out
export const loggingOut = async (): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${AUTH_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error ?? "Logout failed." };
    }
    return data;
  } catch (err) {
    console.error("Logout error: ", err);
    return { success: false, error: "Network error" };
  }
};
