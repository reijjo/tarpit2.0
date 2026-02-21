import {
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express";
import * as z from "zod";

import { AppError } from "../utils/AppError";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError | z.ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError && err.isOperational) {
    console.log("err", err);
    return res
      .status(err.statusCode)
      .json({ error: err.message, success: false });
  }

  if (err instanceof z.ZodError) {
    const { fieldErrors } = z.flattenError(err);
    return res.status(400).json({ success: false, errors: fieldErrors });
  }

  console.error("Unexpected error", err);

  res.status(500).json({ error: "Internal Server Error", success: false });
};
