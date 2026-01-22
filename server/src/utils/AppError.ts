// AppError allows us to create custom errors with status codes (e.g. 404 Not Found)
export class AppError extends Error {
  public readonly statusCode: number;

  // isOperational = true means this is a "known" error we created intentionally (like invalid input).
  // If false, it's a bug/crash we didn't expect.
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    // Call the parent Error class with the message
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // Fixes the prototype chain when extending built-in Error in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);

    // Captures the spot in code where this error occurred (for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}
