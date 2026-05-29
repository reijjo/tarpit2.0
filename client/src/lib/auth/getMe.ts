import type { UserRole } from "@/features/auth/types";
import { cookies } from "next/headers";

import { ApiResponse } from "../types/apiResponse";

import { config } from "../utils/envConfig";

type MeData = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};

const ME_URL = `${config.BACKEND_URL}/api/auth/me`;

export async function getMe(): Promise<ApiResponse<MeData>> {
  const cookieHeader = (await cookies()).toString();

  if (!cookieHeader) {
    return {
      success: false,
      error: "No cookies found.",
    };
  }

  try {
    const res = await fetch(`${ME_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch user data.",
        status: res.status,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return {
      success: false,
      error: "Failed to fetch user data. Please try again.",
    };
  }
}
