import { Role, type User } from "@prisma/client";
import { mock } from "bun:test";
import type { NextFunction } from "express";

const createExistingUser = (): User => {
  return {
    id: 1,
    email: "existing@example.com",
    username: "existing_user",
    password: "hashed-password",
    role: Role.GUEST,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };
};

const prismaUserFindUniqueMock = mock(
  async (_args: { where: { email?: string; username?: string } }) =>
    null as User | null,
);

const prismaUserCreateMock = mock(
  async (_args: { data: { email: string; username: string; password: string } }) =>
    createExistingUser(),
);

mock.module("src/utils/prisma", () => {
  return {
    prisma: {
      user: {
        findUnique: prismaUserFindUniqueMock,
        create: prismaUserCreateMock,
      },
    },
  };
});

const createNextCapture = () => {
  let lastError: unknown;
  const nextSpy = mock((error?: unknown) => {
    lastError = error;
  });

  return {
    next: nextSpy as unknown as NextFunction,
    nextSpy,
    getLastError: () => lastError,
  };
};

const resetAuthControllerMocks = () => {
  prismaUserFindUniqueMock.mockReset();
  prismaUserFindUniqueMock.mockResolvedValue(null);
  prismaUserCreateMock.mockReset();
  prismaUserCreateMock.mockResolvedValue(createExistingUser());
};

export {
  createExistingUser,
  createNextCapture,
  prismaUserCreateMock,
  prismaUserFindUniqueMock,
  resetAuthControllerMocks,
};
