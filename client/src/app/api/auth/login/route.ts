import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { config } from "@/lib/utils/envConfig";

export async function POST(req: Request) {
  const { login, password } = await req.json();

  const backendRes = await fetch(`${config.BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
    cache: "no-store",
  });

  const payload = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(payload, { status: backendRes.status });
  }

  const setCookie = backendRes.headers.get("set-cookie") ?? "";
  const token = setCookie.match(/access_token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing access token from backend cookie" },
      { status: 500 },
    );
  }

  (await cookies()).set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json(payload, { status: backendRes.status });
}
