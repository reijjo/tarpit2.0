import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import type { Server } from "http";

import app from "../app";

describe("APP", () => {
  let server: Server;
  const PORT = 3002;
  const baseUrl = `http://localhost:${PORT}`;

  beforeAll((done) => {
    server = app.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test("returns 404 for unknown routes", async () => {
    const response = await fetch(`${baseUrl}/this-does-not-exist`);
    expect(response.status).toBe(404);
  });
});
