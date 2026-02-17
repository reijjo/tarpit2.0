const isProduction: boolean = process.env.NODE_ENV === "production";
const isTest: boolean = process.env.NODE_ENV === "test";
const PORT: number = Number(process.env.PORT) || 3001;
const DB_URL: string = process.env.DB_URL || "";
const DB_TEST_URL: string = process.env.DB_TEST_URL || "";

const DATABASE_URL = isTest ? DB_TEST_URL : DB_URL;

if (!DATABASE_URL) {
  throw new Error("DB_URL environment variable is not set");
}

export { PORT, isProduction, DATABASE_URL };
