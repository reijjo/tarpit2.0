import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  invalidEmailPayloads,
  invalidUsernamePayloads,
  passwordBoundaryCases,
  usernameBoundaryCases,
} from "@/test/fixtures/auth";
import { createFormData } from "@/test/utils/formData";
import type { RegisterState, RegisterUserData } from "../types/auth";

const { checkDuplicateEmailMock, checkDuplicateUsernameMock, createUserMock } =
  vi.hoisted(() => ({
  checkDuplicateEmailMock: vi.fn<
    (value: string) => Promise<RegisterState>
  >(),
  checkDuplicateUsernameMock: vi.fn<
    (value: string) => Promise<RegisterState>
  >(),
  createUserMock: vi.fn<
    (credentials: RegisterUserData) => Promise<RegisterState>
  >(),
  }));

vi.mock("../api/auth", () => ({
  checkDuplicateEmail: checkDuplicateEmailMock,
  checkDuplicateUsername: checkDuplicateUsernameMock,
  createUser: createUserMock,
}));

import { registerCredentials, registerEmail } from "./auth";

describe("auth actions", () => {
  beforeEach(() => {
    checkDuplicateEmailMock.mockReset();
    checkDuplicateUsernameMock.mockReset();
    createUserMock.mockReset();

    checkDuplicateEmailMock.mockResolvedValue({ success: true });
    checkDuplicateUsernameMock.mockResolvedValue({ success: true });
    createUserMock.mockResolvedValue({
      success: true,
      message: "User created successfully!",
    });
  });

  describe("registerEmail", () => {
    it("returns normalized email when valid", async () => {
      const formData = createFormData({
        email: " TEST@Example.com ",
      });

      const result = await registerEmail({ success: false }, formData);

      expect(result.success).toBe(true);
      expect(result.email).toBe("test@example.com");
    });

    it.each(invalidEmailPayloads)(
      "returns email errors for invalid payload: %s",
      async (email) => {
        const formData = createFormData({ email });

        const result = await registerEmail({ success: false }, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.email).toBeDefined();
      },
    );
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
  });
});
