const BACKEND_URL = process.env.NEXT_PUBLIC_DEV_BACKEND;
const FRONTEND_URL = process.env.NEXT_PUBLIC_DEV_FRONTEND;

if (!BACKEND_URL) {
  throw new Error("Backend url not found");
}

if (!FRONTEND_URL) {
  throw new Error("Frontend url not found");
}

export const config = {
  BACKEND_URL,
  FRONTEND_URL,
};
