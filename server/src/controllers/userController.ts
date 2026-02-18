import { type NextFunction, type Request, type Response } from "express";

import { AppError } from "src/utils/AppError";
import { prisma } from "src/utils/prisma";
import { RegisterSchema } from "src/utils/schemas/auth";
import type { RegisterUserData } from "src/utils/types/types";

// GET
// Find existing user
export const findExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, username } = req.query as Omit<RegisterUserData, "password">;

  if (!email && !username) {
    return next(new AppError("Invalid query", 400));
  }

  if (email && username) {
    return next(new AppError("Too many params", 400));
  }

  try {
    if (email) {
      const result = await RegisterSchema.pick({ email: true }).safeParseAsync({
        email,
      });

      if (!result.success) {
        throw result.error;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        return next(new AppError("Email already registered", 409));
      }
    }

    if (username) {
      RegisterSchema.pick({ username: true }).safeParse(username);

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (user) {
        return next(new AppError("Username already registered", 409));
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// GET
// Find user by Id
export const findUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
