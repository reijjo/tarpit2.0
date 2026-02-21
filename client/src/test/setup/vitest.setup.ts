import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/lib/utils/envConfig", () => ({
  config: {
    BACKEND_URL: "http://localhost:3001",
  },
}));
