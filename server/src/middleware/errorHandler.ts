import {
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express";

import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Ooops, error", err.stack);

  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).send(err.message);
  }

  console.error("Unexpected error", err);

  res.status(status).send(message);
};
