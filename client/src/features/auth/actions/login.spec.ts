import { loginUser } from "./login";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFormData } from "@/test/utils/formData";

import type { LoginState } from "../types";

const { loggingInMock } = vi.hoisted(() => ({
  loggingInMock: vi.fn(),
}));

vi.mock("../api", () => ({
  loggingIn: loggingInMock,
}));

describe("loginUser", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    loggingInMock.mockReset();
    consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    loggingInMock.mockResolvedValue({
      success: true,
      message: "Welcome!",
      data: {
        user_id: "user-id",
        role: "GUEST",
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("normalizes login input before sending credentials", async () => {
    const formData = createFormData({
      login: "  TEST@Example.com  ",
      password: "Password1!",
    });

    const result = await loginUser({ success: false } as LoginState, formData);

    expect(result).toEqual({ success: true });
    expect(loggingInMock).toHaveBeenCalledWith({
      login: "test@example.com",
      password: "Password1!",
    });
  });

  it("returns validation errors for short login values", async () => {
    const formData = createFormData({
      login: "ab",
      password: "Password1!",
    });

    const result = await loginUser({ success: false } as LoginState, formData);

    expect(result.success).toBe(false);
    expect(result.errors?.login).toBeDefined();
    expect(loggingInMock).not.toHaveBeenCalled();
  });

  it("returns backend errors without leaking sensitive data", async () => {
    loggingInMock.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });

    const formData = createFormData({
      login: "test@example.com",
      password: "Password1!",
    });

    const result = await loginUser({ success: false } as LoginState, formData);

    expect(result).toEqual({
      success: false,
      error: "Invalid credentials",
      login: "test@example.com",
      password: "",
    });
  });
});
