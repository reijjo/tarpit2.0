import { test, expect, describe } from "bun:test";

import { AppError } from "../../utils/AppError";

import { errorHandler } from "../../middleware/errorHandler";
import {
  createMockRequest,
  createMockResponse,
  createMockNext,
} from "../setup/mocks";

describe("ERROR_HANDLER", () => {
  test("handles operational AppError", () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = new AppError("Not found", 404);

    errorHandler(error, req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res.body).toBe("Not found");
  });

  test("handles non-operational errors as 500", () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = new Error("Unexpected error");

    errorHandler(error, req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe("Internal Server Error");
  });

  test("handles non-operational AppError", () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = new AppError("DB connection failed", 500, false);

    errorHandler(error, req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body).toBe("Internal Server Error");
  });
});
