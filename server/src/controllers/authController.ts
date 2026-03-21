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

// auth/verify
// GET
// Verify the user
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.query;

  if (!token || typeof token !== "string" || token.length > 100) {
    return next(new AppError("No token", 400));
  }

  try {
    const foundToken = await prisma.token.findUnique({
      where: { token: token as string },
      include: { user: true },
    });

    if (!foundToken) {
      return next(new AppError("No token found", 404));
    }

    if (foundToken.user.verified) {
      return res.status(200).json({
        success: true,
        message: "Already verified! You can now login.",
      });
    }

    if (foundToken.expiresAt < new Date()) {
      return next(new AppError("Token expired", 401));
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: foundToken.userId },
        data: { verified: true },
      });
    });

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
