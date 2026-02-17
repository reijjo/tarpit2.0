import "dotenv/config";
import { defineConfig } from "prisma/config";

const isTest = process.env.NODE_ENV === "test";
const urlVar = isTest ? "DB_TEST_URL" : "DB_URL";
const datasourceUrl = process.env[urlVar];

if (!datasourceUrl) {
  throw new Error(`${urlVar} environment variable is not set`);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
