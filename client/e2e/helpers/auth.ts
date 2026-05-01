import { APIRequestContext } from "@playwright/test";

export type E2EUserCredentials = {
  email: string;
  username: string;
  password: string;
};

export type RegisterE2EUserOptions = Partial<E2EUserCredentials> & {
  backendUrl?: string;
};

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_DEV_BACKEND ?? "http://127.0.0.1:3001";
const DEFAULT_PASSWORD = "TestPass123!";

const uniqueSuffix = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const buildE2EUserCredentials = (
  overrides: Partial<E2EUserCredentials> = {},
): E2EUserCredentials => {
  const suffix = uniqueSuffix();

  return {
    email: overrides.email ?? `e2e-${suffix}@example.com`,
    username: overrides.username ?? `u${suffix.replace(/[^a-z0-9]/g, "").slice(0, 11)}`,
    password: overrides.password ?? DEFAULT_PASSWORD,
  };
};

export const registerE2EUser = async (
  request: APIRequestContext,
  options: RegisterE2EUserOptions = {},
): Promise<E2EUserCredentials> => {
  const credentials = buildE2EUserCredentials(options);
  const backendUrl = options.backendUrl ?? DEFAULT_BACKEND_URL;

  const response = await request.post(`${backendUrl}/api/auth/register`, {
    data: credentials,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok()) {
    const errorMessage =
      body && typeof body === "object" && "error" in body
        ? String(body.error)
        : JSON.stringify(body);

    throw new Error(
      `Failed to register e2e user (${response.status()} ${response.statusText()}): ${errorMessage}`,
    );
  }

  if (!body || typeof body !== "object" || !("success" in body) || body.success !== true) {
    throw new Error(
      `Register API returned unexpected response shape: ${JSON.stringify(body)}`,
    );
  }

  return credentials;
};
