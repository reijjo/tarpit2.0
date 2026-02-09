import type { Request, Response, NextFunction } from "express";

export const createMockRequest = (overrides?: Partial<Request>): Request => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    method: "GET",
    url: "/",
    ...overrides,
  } as Request;
};

export const createMockResponse = () => {
  const res = {} as Response & {
    statusCode?: number;
    body?: any;
  };

  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  res.send = (data: any) => {
    res.body = data;
    return res;
  };

  res.json = (data: any) => {
    res.body = data;
    return res;
  };

  return res;
};

export const createMockNext = (): NextFunction => {
  return (() => {}) as NextFunction;
};
