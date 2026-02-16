import { describe, expect, it } from "vitest";

import {
  invalidEmailPayloads,
  invalidPasswordCases,
  invalidUsernamePayloads,
  passwordBoundaryCases,
  usernameBoundaryCases,
} from "@/test/fixtures/auth";

import { RegisterSchema } from "./auth";

describe("RegisterSchema", () => {
  it("accepts and normalizes a valid register payload", () => {
    const result = RegisterSchema.safeParse({
      email: " TEST@Example.com ",
      username: "  USER_name  ",
      password: "Password1!",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
      expect(result.data.username).toBe("user_name");
    }
  });

  it.each(invalidUsernamePayloads)("rejects username payload: %s", (username) => {
    const result = RegisterSchema.safeParse({
      email: "test@example.com",
      username,
      password: "Password1!",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain("Only numbers, letters, and ._- allowed");
    }
  });

  it.each(invalidEmailPayloads)("rejects email payload: %s", (email) => {
    const result = RegisterSchema.safeParse({
      email,
      username: "valid_user",
      password: "Password1!",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain("Invalid email");
    }
  });

  it.each(invalidPasswordCases)(
    "rejects password $label",
    ({ value, expectedError }) => {
      const result = RegisterSchema.safeParse({
        email: "test@example.com",
        username: "valid_user",
        password: value,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        const messages = result.error.issues.map((issue) => issue.message);
        expect(messages).toContain(expectedError);
      }
    },
  );

  it.each(usernameBoundaryCases)(
    "handles username boundary: $label",
    ({ value, isValid, expectedError, normalized }) => {
      const result = RegisterSchema.safeParse({
        email: "test@example.com",
        username: value,
        password: "Password1!",
      });

      expect(result.success).toBe(isValid);

      if (isValid && result.success) {
        expect(result.data.username).toBe(normalized);
      }

      if (!isValid && !result.success) {
        const messages = result.error.issues.map((issue) => issue.message);

        if (expectedError) {
          expect(messages).toContain(expectedError);
        }
      }
    },
  );

  it.each(passwordBoundaryCases)(
    "handles password boundary: $label",
    ({ value, isValid, expectedError }) => {
      const result = RegisterSchema.safeParse({
        email: "test@example.com",
        username: "valid_user",
        password: value,
      });

      expect(result.success).toBe(isValid);

      if (!isValid && !result.success) {
        const messages = result.error.issues.map((issue) => issue.message);

        if (expectedError) {
          expect(messages).toContain(expectedError);
        }
      }
    },
  );
});
