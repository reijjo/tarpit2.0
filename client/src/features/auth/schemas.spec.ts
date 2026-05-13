import { RegisterSchema } from "./schemas";
import {
  invalidEmailPayloads,
  invalidPasswordCases,
  invalidUsernamePayloads,
  passwordBoundaryCases,
  usernameBoundaryCases,
} from "@/test/fixtures/auth";
import { describe, expect, it } from "vitest";

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

  it.each(invalidUsernamePayloads)(
    "rejects username payload: %s",
    (username) => {
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
    },
  );

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
    (testCase) => {
      const result = RegisterSchema.safeParse({
        email: "test@example.com",
        username: testCase.value,
        password: "Password1!",
      });

      expect(result.success).toBe(testCase.isValid);

      if (testCase.isValid && result.success && "normalized" in testCase) {
        expect(result.data.username).toBe(testCase.normalized);
      }

      if (!testCase.isValid && !result.success) {
        const messages = result.error.issues.map((issue) => issue.message);

        if ("expectedError" in testCase) {
          expect(messages).toContain(testCase.expectedError);
        }
      }
    },
  );

  it.each(passwordBoundaryCases)(
    "handles password boundary: $label",
    (testCase) => {
      const result = RegisterSchema.safeParse({
        email: "test@example.com",
        username: "valid_user",
        password: testCase.value,
      });

      expect(result.success).toBe(testCase.isValid);

      if (!testCase.isValid && !result.success && "expectedError" in testCase) {
        const messages = result.error.issues.map((issue) => issue.message);
        expect(messages).toContain(testCase.expectedError);
      }
    },
  );
});
