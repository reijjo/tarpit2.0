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
});
