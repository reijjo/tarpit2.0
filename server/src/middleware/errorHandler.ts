import type { ErrorRequestHandler } from "express";

type HttpError = Error & { status?: number; statusCode?: number };

export const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  _req,
  res,
  _next,
) => {
  console.error("Ooops, error", err.stack);

  const status = err.statusCode ?? err.status ?? 500;
  res.status(status).send(err.message || "Internal Server Error");
};
