const PORT: number = Number(process.env.PORT) || 3001;
const isProduction: boolean = process.env.NODE_ENV === "production";
const DB_URL: string = process.env.DB_URL || "";
const DB_TEST_URL: string = process.env.DB_TEST_URL || "";

if (!DB_URL) {
  throw new Error("DB_URL environment variable is not set");
}

export {
  PORT,
  isProduction,
  DB_URL,
  DB_TEST_URL,
};
