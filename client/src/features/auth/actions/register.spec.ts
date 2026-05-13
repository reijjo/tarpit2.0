import { registerCredentials, registerEmail } from "./register";
import {
  invalidEmailPayloads,
  invalidUsernamePayloads,
  passwordBoundaryCases,
  usernameBoundaryCases,
} from "@/test/fixtures/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFormData } from "@/test/utils/formData";

import type { RegisterState, RegisterUserData } from "../types";

const { checkDuplicateEmailMock, checkDuplicateUsernameMock, createUserMock } =
  vi.hoisted(() => ({
    checkDuplicateEmailMock: vi.fn<(value: string) => Promise<RegisterState>>(),
    checkDuplicateUsernameMock:
      vi.fn<(value: string) => Promise<RegisterState>>(),
    createUserMock:
      vi.fn<(credentials: RegisterUserData) => Promise<RegisterState>>(),
  }));

vi.mock("../api", () => ({
  checkDuplicateEmail: checkDuplicateEmailMock,
  checkDuplicateUsername: checkDuplicateUsernameMock,
  createUser: createUserMock,
}));

describe("auth actions", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    checkDuplicateEmailMock.mockReset();
    checkDuplicateUsernameMock.mockReset();
    createUserMock.mockReset();
    consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    checkDuplicateEmailMock.mockResolvedValue({ success: true });
    checkDuplicateUsernameMock.mockResolvedValue({ success: true });
    createUserMock.mockResolvedValue({
      success: true,
      message: "User created successfully!",
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("registerEmail", () => {
    it("returns normalized email when valid", async () => {
      const formData = createFormData({
        email: " TEST@Example.com ",
      });

      const result = await registerEmail({ success: false }, formData);

      expect(result.success).toBe(true);
      expect(result.email).toBe("test@example.com");
      expect(checkDuplicateEmailMock).toHaveBeenCalledWith("test@example.com");
    });

    it.each(invalidEmailPayloads)(
      "returns email errors for invalid payload: %s",
      async (email) => {
        const formData = createFormData({ email });

        const result = await registerEmail({ success: false }, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.email).toBeDefined();
        expect(checkDuplicateEmailMock).not.toHaveBeenCalled();
      },
    );

    it("returns API duplicate error message for already registered email", async () => {
      checkDuplicateEmailMock.mockResolvedValue({
        success: false,
        error: "Email already registered",
      });

      const formData = createFormData({
        email: "taken@example.com",
      });

      const result = await registerEmail({ success: false }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.email).toEqual(["Email already registered"]);
    });

    it("returns fallback field error when duplicate check throws", async () => {
      checkDuplicateEmailMock.mockRejectedValue(
        new Error("service unavailable"),
      );

      const formData = createFormData({
        email: "test@example.com",
      });

      const result = await registerEmail({ success: false }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.email).toEqual([
        "Could not validate email right now. Please try again.",
      ]);
    });
  });

  describe("registerCredentials", () => {
    it("accepts credentials with email and username that need normalization", async () => {
      const formData = createFormData({
        email: " TEST@Example.com ",
        username: "  VALID_User  ",
        password: "Password1!",
      });

      const result = await registerCredentials({ success: false }, formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe("User created successfully!");
      expect(checkDuplicateUsernameMock).toHaveBeenCalledWith("valid_user");
      expect(createUserMock).toHaveBeenCalledWith({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });
    });

    it.each(invalidUsernamePayloads)(
      "rejects username payload: %s",
      async (username) => {
        const formData = createFormData({
          email: "test@example.com",
          username,
          password: "Password1!",
        });

        const result = await registerCredentials({ success: false }, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.username).toBeDefined();
        expect(result.username).toBe(String(username));
        expect(result.password).toBe("");
      },
    );

    it.each(invalidEmailPayloads)(
      "rejects email payload in credentials flow: %s",
      async (email) => {
        const formData = createFormData({
          email,
          username: "valid_user",
          password: "Password1!",
        });

        const result = await registerCredentials({ success: false }, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.email).toBeDefined();
      },
    );

    it.each(usernameBoundaryCases)(
      "handles username boundary in credentials flow: $label",
      async ({ value, isValid }) => {
        const formData = createFormData({
          email: "test@example.com",
          username: value,
          password: "Password1!",
        });

        const result = await registerCredentials({ success: false }, formData);

        expect(result.success).toBe(isValid);

        if (isValid) {
          expect(result.message).toBe("User created successfully!");
        } else {
          expect(result.errors?.username).toBeDefined();
          expect(result.password).toBe("");
        }
      },
    );

    it("returns field error when username is already taken", async () => {
      checkDuplicateUsernameMock.mockResolvedValue({
        success: false,
        error: "Username already registered",
      });

      const formData = createFormData({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });

      const result = await registerCredentials({ success: false }, formData);

      expect(result.success).toBe(false);
      expect(result.errors?.username).toEqual(["Username already registered"]);
      expect(result.username).toBe("valid_user");
      expect(result.password).toBe("");
      expect(createUserMock).not.toHaveBeenCalled();
    });

    it.each(passwordBoundaryCases)(
      "handles password boundary in credentials flow: $label",
      async ({ value, isValid }) => {
        const formData = createFormData({
          email: "test@example.com",
          username: "valid_user",
          password: value,
        });

        const result = await registerCredentials({ success: false }, formData);

        expect(result.success).toBe(isValid);

        if (isValid) {
          expect(result.message).toBe("User created successfully!");
        } else {
          expect(result.errors?.password).toBeDefined();
          expect(result.password).toBe("");
        }
      },
    );

    it.each([
      {
        label: "invalid email format",
        payload: {
          email: "not-an-email",
          username: "valid_user",
          password: "Password1!",
        },
        field: "email",
      },
      {
        label: "boundary invalid username (too short)",
        payload: {
          email: "test@example.com",
          username: "ab",
          password: "Password1!",
        },
        field: "username",
      },
      {
        label: "injection-like username payload",
        payload: {
          email: "test@example.com",
          username: "<script>alert(1)</script>",
          password: "Password1!",
        },
        field: "username",
      },
      {
        label: "boundary invalid password (too short)",
        payload: {
          email: "test@example.com",
          username: "valid_user",
          password: "Aa1!aaa",
        },
        field: "password",
      },
      {
        label: "all lowercase with special chars (missing uppercase)",
        payload: {
          email: "test@example.com",
          username: "valid_user",
          password: "' OR 1=1 --",
        },
        field: "password",
      },
    ] as const)(
      "short-circuits before duplicate/create calls for $label",
      async ({ payload, field }) => {
        const formData = createFormData(payload);

        const result = await registerCredentials({ success: false }, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.[field]).toBeDefined();
        expect(checkDuplicateUsernameMock).not.toHaveBeenCalled();
        expect(createUserMock).not.toHaveBeenCalled();
      },
    );

    it("returns API error when createUser returns success false", async () => {
      createUserMock.mockResolvedValue({
        success: false,
        error: "Email already registered",
      });

      const formData = createFormData({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });

      const result = await registerCredentials({ success: false }, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email already registered");
      expect(result.username).toBe("valid_user");
      expect(result.password).toBe("");
    });

    it("returns fallback error when duplicate username check throws", async () => {
      checkDuplicateUsernameMock.mockRejectedValue(new Error("network down"));

      const formData = createFormData({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });

      const result = await registerCredentials({ success: false }, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Registration failed. Please try again");
      expect(result.username).toBe("valid_user");
      expect(result.password).toBe("");
      expect(createUserMock).not.toHaveBeenCalled();
    });

    it("returns fallback error when createUser throws", async () => {
      createUserMock.mockRejectedValue(new Error("db unavailable"));

      const formData = createFormData({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });

      const result = await registerCredentials({ success: false }, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Registration failed. Please try again");
      expect(result.username).toBe("valid_user");
      expect(result.password).toBe("");
    });
  });
});
