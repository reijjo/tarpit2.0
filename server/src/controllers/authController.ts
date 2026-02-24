import type { Request, Response, NextFunction } from "express";

import { isTest } from "src/utils/config";

import { AppError } from "src/utils/AppError";
import { createToken } from "src/utils/auth/createToken";
import { confirmAccount } from "src/utils/auth/emailService";
import { prisma } from "src/utils/prisma";
import { type RegisterData, RegisterSchema } from "src/utils/schemas/auth";

// auth/available
// GET
// Find existing user
export const findExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, username } = req.query as Omit<RegisterData, "password">;

  if (!email && !username) {
    return next(new AppError("Invalid query", 400));
  }

  if (email && username) {
    return next(new AppError("Too many params", 400));
  }

  try {
    if (email) {
      const result = RegisterSchema.pick({ email: true }).safeParse({
        email,
      });

      if (!result.success) {
        throw result.error;
      }

      const user = await prisma.user.findUnique({
        where: { email: result.data.email },
      });

      if (user) {
        return next(new AppError("Email already registered", 409));
      }
    }

    if (username) {
      const result = RegisterSchema.pick({ username: true }).safeParse({
        username,
      });

      if (!result.success) {
        throw result.error;
      }

      const user = await prisma.user.findUnique({
        where: { username: result.data.username },
      });

      if (user) {
        return next(new AppError("Username already registered", 409));
      }
    }

    res
      .status(200)
      .json({ success: true, message: "No duplicate email/username found." });
  } catch (err) {
    next(err);
  }
};

// /auth/register
// POST
// Create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return next(new AppError("Missing fields", 400));
  }

  try {
    const result = RegisterSchema.safeParse({ email, username, password });
    if (!result.success) {
      throw result.error;
    }

    const emailCheck = await prisma.user.findUnique({
      where: { email: result.data.email },
    });
    if (emailCheck) {
      return next(new AppError("Email already registered", 409));
    }

    const usernameCheck = await prisma.user.findUnique({
      where: { username: result.data.username },
    });
    if (usernameCheck) {
      return next(new AppError("Username already registered", 409));
    }

    const okData = result.data;
    const hashPasswd = await Bun.password.hash(okData.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const newUser = await prisma.user.create({
      data: {
        email: okData.email,
        username: okData.username,
        password: hashPasswd,
      },
    });

    if (!isTest) {
      try {
        const token = await createToken(newUser.id);
        await confirmAccount(okData.email, token);
      } catch (err) {
        await prisma.user.delete({ where: { id: newUser.id } });
        return next(
          new AppError(
            "Failed to send verification email, please try again.",
            500,
          ),
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Check your email to validate your account.",
    });
  } catch (err) {
    console.log("register error", err);
    next(err);
  }
};
