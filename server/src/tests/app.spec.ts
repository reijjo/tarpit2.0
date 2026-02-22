import { test, expect, describe } from "bun:test";

import app from "../app";
import { unknownEndpoint } from "../middleware/unknownEndpoint";
import { createMockRequest, createMockResponse } from "./setup/mocks";

type RouteLayer = {
  route?: {
    path: string;
    methods: Record<string, boolean | undefined>;
  };
  name?: string;
  regexp?: RegExp;
};

type RouterLayer = {
  stack?: RouteLayer[];
};

type AppWithRouter = {
  _router?: RouterLayer;
};

const getAppLayers = (): RouteLayer[] => {
  const expressApp = app as unknown as AppWithRouter;
  return expressApp._router?.stack ?? [];
};

describe("APP", () => {
  test("registers GET / health route", () => {
    const hasHealthRoute = getAppLayers().some(
      (layer) => layer.route?.path === "/" && layer.route.methods.get === true,
    );

    expect(hasHealthRoute).toBe(true);
  });

  test("mounts auth and users routers", () => {
    const routerRegexes = getAppLayers()
      .filter((layer) => layer.name === "router" && layer.regexp instanceof RegExp)
      .map((layer) => layer.regexp?.toString() ?? "");

    expect(routerRegexes.some((regex) => regex.includes("\\/auth"))).toBe(true);
    expect(routerRegexes.some((regex) => regex.includes("\\/users"))).toBe(true);
  });

  test("unknownEndpoint returns 404 payload", () => {
    const req = createMockRequest({ url: "/this-does-not-exist" });
    const res = createMockResponse();

    unknownEndpoint(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "nothing here" });
  });
});
