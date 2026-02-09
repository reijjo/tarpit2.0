import { baseUrl } from "./setup/test-setup";
import { test, expect, describe } from "bun:test";

describe("APP", () => {
  test("returns 404 for unknown routes", async () => {
    const response = await fetch(`${baseUrl}/this-does-not-exist`);
    expect(response.status).toBe(404);
  });
});
