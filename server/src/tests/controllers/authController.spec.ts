import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  mock,
  spyOn,
} from "bun:test";
import { ZodError } from "zod";

import { AppError } from "src/utils/AppError";
import type { RegisterData } from "src/utils/schemas/auth";

import { createMockRequest, createMockResponse } from "../setup/mocks";
import {
  createExistingUser,
  createNextCapture,
  prismaUserCreateMock,
  prismaUserFindUniqueMock,
  resetAuthControllerMocks,
} from "../setup/authControllerMocks";

type RegisterField = keyof RegisterData;

let findExistingUser: typeof import("src/controllers/authController")["findExistingUser"];
let createUser: typeof import("src/controllers/authController")["createUser"];
let verifyUser: typeof import("src/controllers/authController")["verifyUser"];

const expectAppError = (
  error: unknown,
  expectedMessage: string,
  expectedStatusCode: number,
) => {
  expect(error).toBeInstanceOf(AppError);

  const appError = error as AppError;
  expect(appError.message).toBe(expectedMessage);
  expect(appError.statusCode).toBe(expectedStatusCode);
};

const expectZodFieldError = (error: unknown, field: RegisterField) => {
  expect(error).toBeInstanceOf(ZodError);

  const zodError = error as ZodError;
  const hasMatchingIssue = zodError.issues.some((issue) => issue.path[0] === field);
  expect(hasMatchingIssue).toBe(true);
};

describe("AUTH_CONTROLLER", () => {
  beforeAll(async () => {
    const authController = await import("src/controllers/authController");
    findExistingUser = authController.findExistingUser;
    createUser = authController.createUser;
    verifyUser = authController.verifyUser;
  });

  afterAll(() => {
    mock.restore();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetAuthControllerMocks();
  });

  describe("findExistingUser", () => {
    it("returns 400 when no query params are provided", async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await findExistingUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Invalid query", 400);
      expect(prismaUserFindUniqueMock).not.toHaveBeenCalled();
    });

    it("returns 400 when both email and username are provided", async () => {
      const req = createMockRequest({
        query: { email: "test@example.com", username: "testuser" },
      });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await findExistingUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Too many params", 400);
      expect(prismaUserFindUniqueMock).not.toHaveBeenCalled();
    });

    it.each([
      ["invalid format", "invalid-email"],
      ["CRLF-like payload", "user@example.com\r\nX-Injected: true"],
    ])(
      "forwards zod errors for email query (%s)",
      async (_label, emailQueryValue) => {
        const req = createMockRequest({ query: { email: emailQueryValue } });
        const res = createMockResponse();
        const { next, nextSpy, getLastError } = createNextCapture();

        await findExistingUser(req, res, next);

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expectZodFieldError(getLastError(), "email");
        expect(prismaUserFindUniqueMock).not.toHaveBeenCalled();
      },
    );

    it("returns 409 when email already exists", async () => {
      const req = createMockRequest({ query: { email: "used@example.com" } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      prismaUserFindUniqueMock.mockResolvedValueOnce(createExistingUser());

      await findExistingUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledWith({
        where: { email: "used@example.com" },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Email already registered", 409);
    });

    it("returns 200 when email is available and normalizes input", async () => {
      const req = createMockRequest({ query: { email: "  TEST@EXAMPLE.COM  " } });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();

      prismaUserFindUniqueMock.mockResolvedValueOnce(null);

      await findExistingUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "No duplicate email/username found.",
      });
    });

    it.each([
      ["too short", "ab"],
      ["XSS-like payload", "<script>alert('x')</script>"],
    ])(
      "forwards zod errors for username query (%s)",
      async (_label, usernameQueryValue) => {
        const req = createMockRequest({ query: { username: usernameQueryValue } });
        const res = createMockResponse();
        const { next, nextSpy, getLastError } = createNextCapture();

        await findExistingUser(req, res, next);

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expectZodFieldError(getLastError(), "username");
        expect(prismaUserFindUniqueMock).not.toHaveBeenCalled();
      },
    );

    it("returns 409 when username already exists", async () => {
      const req = createMockRequest({ query: { username: "taken_user" } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      prismaUserFindUniqueMock.mockResolvedValueOnce(createExistingUser());

      await findExistingUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledWith({
        where: { username: "taken_user" },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Username already registered", 409);
    });

    it("returns 200 when username is available and normalizes input", async () => {
      const req = createMockRequest({ query: { username: "  Mixed_User  " } });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();

      prismaUserFindUniqueMock.mockResolvedValueOnce(null);

      await findExistingUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledWith({
        where: { username: "mixed_user" },
      });
      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "No duplicate email/username found.",
      });
    });
  });

  describe("createUser", () => {
    beforeEach(() => {
      spyOn(console, "log").mockImplementation(() => undefined);
    });

    it.each([
      ["email is missing", { username: "valid_user", password: "Aa1!aaaa" }],
      ["username is missing", { email: "valid@example.com", password: "Aa1!aaaa" }],
      ["password is missing", { email: "valid@example.com", username: "valid_user" }],
    ])("returns 400 when %s", async (_label, requestBody) => {
      const req = createMockRequest({ body: requestBody });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await createUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Missing fields", 400);
      expect(prismaUserFindUniqueMock).not.toHaveBeenCalled();
    });

    it.each<
      [string, RegisterData, RegisterField]
    >([
      [
        "invalid email format",
        {
          email: "not-an-email",
          username: "valid_user",
          password: "Aa1!aaaa",
        },
        "email",
      ],
      [
        "username too short",
        {
          email: "valid@example.com",
          username: "ab",
          password: "Aa1!aaaa",
        },
        "username",
      ],
      [
        "XSS-like username payload",
        {
          email: "valid@example.com",
          username: "<script>alert(1)</script>",
          password: "Aa1!aaaa",
        },
        "username",
      ],
      [
        "weak password format",
        {
          email: "valid@example.com",
          username: "valid_user",
          password: "alllowercase",
        },
        "password",
      ],
      [
        "SQL-like password payload",
        {
          email: "valid@example.com",
          username: "valid_user",
          password: "' OR 1=1 --",
        },
        "password",
      ],
    ])(
      "forwards zod validation errors for %s",
      async (_label, requestBody, expectedField) => {
        const req = createMockRequest({ body: requestBody });
        const res = createMockResponse();
        const { next, nextSpy, getLastError } = createNextCapture();
        const hashSpy = spyOn(Bun.password, "hash");

        await createUser(req, res, next);

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expectZodFieldError(getLastError(), expectedField);
        expect(prismaUserFindUniqueMock).not.toHaveBeenCalled();
        expect(hashSpy).not.toHaveBeenCalled();
        expect(prismaUserCreateMock).not.toHaveBeenCalled();
      },
    );

    it("returns 409 when email already exists", async () => {
      const req = createMockRequest({
        body: {
          email: "used@example.com",
          username: "new_user",
          password: "Aa1!aaaa",
        } satisfies RegisterData,
      });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();
      const hashSpy = spyOn(Bun.password, "hash");

      prismaUserFindUniqueMock.mockResolvedValueOnce(createExistingUser());

      await createUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledTimes(1);
      expect(prismaUserFindUniqueMock).toHaveBeenCalledWith({
        where: { email: "used@example.com" },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Email already registered", 409);
      expect(hashSpy).not.toHaveBeenCalled();
      expect(prismaUserCreateMock).not.toHaveBeenCalled();
    });

    it("returns 409 when username already exists", async () => {
      const req = createMockRequest({
        body: {
          email: "new@example.com",
          username: "taken_user",
          password: "Aa1!aaaa",
        } satisfies RegisterData,
      });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();
      const hashSpy = spyOn(Bun.password, "hash");

      prismaUserFindUniqueMock
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(createExistingUser());

      await createUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledTimes(2);
      expect(prismaUserFindUniqueMock).toHaveBeenNthCalledWith(1, {
        where: { email: "new@example.com" },
      });
      expect(prismaUserFindUniqueMock).toHaveBeenNthCalledWith(2, {
        where: { username: "taken_user" },
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Username already registered", 409);
      expect(hashSpy).not.toHaveBeenCalled();
      expect(prismaUserCreateMock).not.toHaveBeenCalled();
    });

    it("returns 201 and creates user when payload is valid", async () => {
      const req = createMockRequest({
        body: {
          email: "  NEW@EXAMPLE.COM  ",
          username: "  Mixed_User  ",
          password: "Aa1!aaaa",
        } satisfies RegisterData,
      });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();
      const hashSpy = spyOn(Bun.password, "hash").mockResolvedValueOnce(
        "hashed-password",
      );

      prismaUserFindUniqueMock.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      prismaUserCreateMock.mockResolvedValueOnce(createExistingUser());

      await createUser(req, res, next);

      expect(prismaUserFindUniqueMock).toHaveBeenCalledTimes(2);
      expect(prismaUserFindUniqueMock).toHaveBeenNthCalledWith(1, {
        where: { email: "new@example.com" },
      });
      expect(prismaUserFindUniqueMock).toHaveBeenNthCalledWith(2, {
        where: { username: "mixed_user" },
      });
      expect(hashSpy).toHaveBeenCalledWith("Aa1!aaaa", {
        algorithm: "bcrypt",
        cost: 10,
      });
      expect(prismaUserCreateMock).toHaveBeenCalledWith({
        data: {
          email: "new@example.com",
          username: "mixed_user",
          password: "hashed-password",
        },
      });
      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: "Check your email to validate your account.",
      });
    });

    it("forwards database errors from prisma.user.create", async () => {
      const req = createMockRequest({
        body: {
          email: "new@example.com",
          username: "new_user",
          password: "Aa1!aaaa",
        } satisfies RegisterData,
      });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();
      const dbError = new Error("db write failed");

      prismaUserFindUniqueMock.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      spyOn(Bun.password, "hash").mockResolvedValueOnce("hashed-password");
      prismaUserCreateMock.mockRejectedValueOnce(dbError);

      await createUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(getLastError()).toBe(dbError);
      expect(res.statusCode).toBeUndefined();
    });
  });

  describe("verifyUser", () => {
    it("returns 400 when token is missing from query params", async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "No token", 400);
    });

    it("returns 400 when token is null", async () => {
      const req = createMockRequest({ query: { token: null as unknown as string } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "No token", 400);
    });

    it("returns 400 when token is not a string", async () => {
      const req = createMockRequest({ query: { token: 123 as unknown as string } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "No token", 400);
    });

    it("returns 400 when token is too long (>100 characters)", async () => {
      const longToken = "a".repeat(101);
      const req = createMockRequest({ query: { token: longToken } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "No token", 400);
    });

    it("returns 404 when token does not exist in database", async () => {
      const req = createMockRequest({ query: { token: "nonexistent_token" } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      // Mock token not found
      const prismaTokenFindUniqueMock = mock(async () => null);
      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
        },
      }));

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "No token found", 404);
    });

    it("returns 200 when user is already verified", async () => {
      const req = createMockRequest({ query: { token: "valid_token" } });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();

      // Mock token found with verified user
      const prismaTokenFindUniqueMock = mock(async () => ({
        token: "valid_token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
        userId: 1,
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
        },
      }));

      await verifyUser(req, res, next);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Already verified! You can now login.",
      });
    });

    it("returns 401 when token is expired", async () => {
      const req = createMockRequest({ query: { token: "expired_token" } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      // Mock expired token
      const prismaTokenFindUniqueMock = mock(async () => ({
        token: "expired_token",
        expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        userId: 1,
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
        },
      }));

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expectAppError(getLastError(), "Token expired", 401);
    });

    it("returns 200 and verifies user when token is valid", async () => {
      const req = createMockRequest({ query: { token: "valid_token" } });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();

      // Mock valid token and unverified user
      const prismaTokenFindUniqueMock = mock(async () => ({
        token: "valid_token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
        userId: 1,
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      const prismaUserUpdateMock = mock(async () => ({
        id: 1,
        email: "test@example.com",
        username: "testuser",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const prismaTransactionMock = mock(async (callback) => {
        const mockTx = {
          user: {
            update: prismaUserUpdateMock,
          },
        };
        return await callback(mockTx);
      });

      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
          user: {
            update: prismaUserUpdateMock,
          },
          $transaction: prismaTransactionMock,
        },
      }));

      await verifyUser(req, res, next);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Account verified successfully",
      });
    });

    it("returns 500 when database transaction fails", async () => {
      const req = createMockRequest({ query: { token: "valid_token" } });
      const res = createMockResponse();
      const { next, nextSpy, getLastError } = createNextCapture();

      // Mock valid token and unverified user
      const prismaTokenFindUniqueMock = mock(async () => ({
        token: "valid_token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
        userId: 1,
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      const prismaTransactionMock = mock(async () => {
        throw new Error("Transaction failed");
      });

      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
          $transaction: prismaTransactionMock,
        },
      }));

      await verifyUser(req, res, next);

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(getLastError()).toBeInstanceOf(Error);
      expect((getLastError() as Error).message).toBe("Transaction failed");
    });

    it("handles SQL injection attempts in token parameter", async () => {
      const maliciousTokens = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "admin'--",
        "admin'/*",
        "' UNION SELECT * FROM users--",
      ];

      for (const token of maliciousTokens) {
        const req = createMockRequest({ query: { token } });
        const res = createMockResponse();
        const { next, nextSpy, getLastError } = createNextCapture();

        // Mock token not found (safe behavior)
        const prismaTokenFindUniqueMock = mock(async () => null);
        mock.module("src/utils/prisma", () => ({
          prisma: {
            token: {
              findUnique: prismaTokenFindUniqueMock,
            },
          },
        }));

        await verifyUser(req, res, next);

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expectAppError(getLastError(), "No token found", 404);
      }
    });

    it("handles XSS payloads in token parameter", async () => {
      const xssTokens = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert(1)>",
        "javascript:alert(1)",
        "<svg onload=alert(1)>",
      ];

      for (const token of xssTokens) {
        const req = createMockRequest({ query: { token } });
        const res = createMockResponse();
        const { next, nextSpy, getLastError } = createNextCapture();

        // Mock token not found (safe behavior)
        const prismaTokenFindUniqueMock = mock(async () => null);
        mock.module("src/utils/prisma", () => ({
          prisma: {
            token: {
              findUnique: prismaTokenFindUniqueMock,
            },
          },
        }));

        await verifyUser(req, res, next);

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expectAppError(getLastError(), "No token found", 404);
      }
    });

    it("handles CRLF injection attempts in token parameter", async () => {
      const crlfTokens = [
        "token\r\nX-Injected: true",
        "token\rX-Injected: true",
        "token\nX-Injected: true",
        "token\r\n\r\nGET / HTTP/1.1\r\nHost: evil.com",
      ];

      for (const token of crlfTokens) {
        const req = createMockRequest({ query: { token } });
        const res = createMockResponse();
        const { next, nextSpy, getLastError } = createNextCapture();

        // Mock token not found (safe behavior)
        const prismaTokenFindUniqueMock = mock(async () => null);
        mock.module("src/utils/prisma", () => ({
          prisma: {
            token: {
              findUnique: prismaTokenFindUniqueMock,
            },
          },
        }));

        await verifyUser(req, res, next);

        expect(nextSpy).toHaveBeenCalledTimes(1);
        expectAppError(getLastError(), "No token found", 404);
      }
    });

    it("handles boundary testing for token length", async () => {
      // Test exactly 100 characters (should pass)
      const validToken = "a".repeat(100);
      const req = createMockRequest({ query: { token: validToken } });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();

      // Mock token found
      const prismaTokenFindUniqueMock = mock(async () => ({
        token: validToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        userId: 1,
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      const prismaUserUpdateMock = mock(async () => ({
        id: 1,
        email: "test@example.com",
        username: "testuser",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const prismaTransactionMock = mock(async (callback) => {
        const mockTx = {
          user: {
            update: prismaUserUpdateMock,
          },
        };
        return await callback(mockTx);
      });

      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
          user: {
            update: prismaUserUpdateMock,
          },
          $transaction: prismaTransactionMock,
        },
      }));

      await verifyUser(req, res, next);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Account verified successfully",
      });
    });

    it("handles concurrent verification attempts gracefully", async () => {
      const req = createMockRequest({ query: { token: "concurrent_token" } });
      const res = createMockResponse();
      const { next, nextSpy } = createNextCapture();

      // Mock token found with unverified user
      const prismaTokenFindUniqueMock = mock(async () => ({
        token: "concurrent_token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        userId: 1,
        user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      const prismaUserUpdateMock = mock(async () => ({
        id: 1,
        email: "test@example.com",
        username: "testuser",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const prismaTransactionMock = mock(async (callback) => {
        const mockTx = {
          user: {
            update: prismaUserUpdateMock,
          },
        };
        return await callback(mockTx);
      });

      mock.module("src/utils/prisma", () => ({
        prisma: {
          token: {
            findUnique: prismaTokenFindUniqueMock,
          },
          user: {
            update: prismaUserUpdateMock,
          },
          $transaction: prismaTransactionMock,
        },
      }));

      // Simulate concurrent requests
      const promises = Array.from({ length: 5 }, () => verifyUser(req, res, next));
      await Promise.all(promises);

      expect(nextSpy).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Account verified successfully",
      });
    });
  });
});
