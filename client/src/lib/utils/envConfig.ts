const { NEXT_PUBLIC_DEV_BACKEND } = process.env;

const BACKEND_URL = NEXT_PUBLIC_DEV_BACKEND;

if (!BACKEND_URL) {
  throw new Error("Backend url not found");
}

export const config = {
  BACKEND_URL,
};
