const isProduction: boolean = process.env.NODE_ENV === "production";
const isTest: boolean = process.env.NODE_ENV === "test";
const PORT: number = Number(process.env.PORT) || 3001;
const DB_URL: string = process.env.DB_URL || "";
const DB_TEST_URL: string = process.env.DB_TEST_URL || "";

const DATABASE_URL = isTest ? DB_TEST_URL : DB_URL;
const requiredDbEnv = isTest ? "DB_TEST_URL" : "DB_URL";

const RESEND_API = process.env.RESEND_API_KEY;
const TARPIT_DOMAIN = process.env.TARPIT_DOMAIN;

if (!DATABASE_URL) {
  throw new Error(`${requiredDbEnv} environment variable is not set`);
}

export { PORT, isProduction, isTest, DATABASE_URL, RESEND_API, TARPIT_DOMAIN };
