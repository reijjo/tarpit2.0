import { describe, it, expect } from "bun:test";

import { getHealthCheck } from "src/controllers/apiController";

import { createMockRequest, createMockResponse } from "../setup/mocks";

describe("API_CONTROLLER", () => {
  it("getHealthCheck returns status ok", () => {
    const req = createMockRequest();
    const res = createMockResponse();

    getHealthCheck(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("ok");
  });

  it("includes uptime in response", () => {
    const req = createMockRequest();
    const res = createMockResponse();

    getHealthCheck(req, res);

    expect(res.body).toHaveProperty("uptime");
    expect(typeof res.body.uptime).toBe("number");
  });
});
