import {
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express";
import * as z from "zod";

import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Ooops, error", err.stack);

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json(err.message);
  }

  if (err instanceof z.ZodError) {
    const { fieldErrors } = z.flattenError(err);
    return res.status(400).json({ success: false, errors: fieldErrors });
  }

  console.error("Unexpected error", err);

  res.status(500).json("Internal Server Error");
};
