import { test, expect } from "bun:test";

import { AppError } from "../utils/AppError";

test("AppError creates error with status code", () => {
  const error = new AppError("Not found", 404);

  expect(error.message).toBe("Not found");
  expect(error.statusCode).toBe(404);
  expect(error.isOperational).toBe(true);
});

test("AppError marks non-operational errors", () => {
  const error = new AppError("Server crash", 500, false);

  expect(error.isOperational).toBe(false);
});
