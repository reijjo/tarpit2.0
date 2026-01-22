import { AppError } from "../utils/AppError";
import { type Request, type Response, type ErrorRequestHandler, type NextFunction } from "express";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Use console.log allowed by rules
  console.error("Ooops, error", err.stack);

  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if ("status" in err && typeof (err as any).status === "number") {
    // Handle third-party errors (like body-parser) that have a status code
    status = (err as any).status;
    message = err.message || message;
  } else if ("statusCode" in err && typeof (err as any).statusCode === "number") {
     status = (err as any).statusCode;
     message = err.message || message;
  }

  res.status(status).send(message);
};
