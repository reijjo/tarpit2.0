const PORT: number = Number(process.env.PORT) || 3001;
const isProduction: boolean = process.env.NODE_ENV === "production";
const BACKEND_URL: string = process.env.BACKEND_URL || "";

// Database
const DB_NAME: string = process.env.DB_NAME || "";
const DB_PORT: string = process.env.DB_PORT || "";
const DB_TEST_NAME: string = process.env.DB_TEST_NAME || "";
const DB_TEST_PORT: string = process.env.DB_TEST_PORT || "";
const POSTGRES_USER: string = process.env.POSTGRES_USER || "";
const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD || "";

const DB_URL: string = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${BACKEND_URL}:${DB_PORT}/${DB_NAME}`;
const DB_TEST_URL: string = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${BACKEND_URL}:${DB_TEST_PORT}/${DB_TEST_NAME}`;

export {
  PORT,
  isProduction,
  BACKEND_URL,
  DB_NAME,
  DB_PORT,
  DB_TEST_NAME,
  DB_TEST_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  DB_URL,
  DB_TEST_URL,
};
