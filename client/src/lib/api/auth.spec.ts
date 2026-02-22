import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkDuplicateEmail, checkDuplicateUsername, createUser } from "./auth";

import type { RegisterUserData } from "../types/auth";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("auth api", () => {
  const fetchMock = vi.fn<typeof fetch>();
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    consoleErrorSpy.mockRestore();
  });

  describe("checkDuplicateEmail", () => {
    it.each([
      [
        "CRLF-like payload",
        "user@example.com\r\nCc:attacker@example.com",
        "user%40example.com%0D%0ACc%3Aattacker%40example.com",
      ],
      [
        "query delimiter payload",
        "user@example.com&admin=true",
        "user%40example.com%26admin%3Dtrue",
      ],
    ])(
      "encodes input safely for %s",
      async (_label, email, encodedEmail) => {
        fetchMock.mockResolvedValue(
          jsonResponse({
            success: true,
            message: "No duplicate email/username found.",
          }),
        );

        const result = await checkDuplicateEmail(email);

        expect(fetchMock).toHaveBeenCalledWith(
          `http://localhost:3001/auth/available?email=${encodedEmail}`,
        );
        expect(result.success).toBe(true);
      },
    );

    it("returns API error payload when backend responds with non-OK", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          {
            success: false,
            error: "Email already registered",
          },
          409,
        ),
      );

      const result = await checkDuplicateEmail("taken@example.com");

      expect(result).toEqual({
        success: false,
        error: "Email already registered",
      });
    });

    it("returns generic request error when non-OK response is not JSON", async () => {
      fetchMock.mockResolvedValue(new Response("not json", { status: 500 }));

      const result = await checkDuplicateEmail("test@example.com");

      expect(result).toEqual({
        success: false,
        error: "Request failed",
      });
    });

    it("returns network error when request throws", async () => {
      fetchMock.mockRejectedValue(new Error("network down"));

      const result = await checkDuplicateEmail("test@example.com");

      expect(result).toEqual({
        success: false,
        error: "Network error",
      });
    });
  });

  describe("checkDuplicateUsername", () => {
    it.each([
      [
        "XSS-like payload",
        "<script>alert(1)</script>",
        "%3Cscript%3Ealert(1)%3C%2Fscript%3E",
      ],
      ["SQL-like payload", "admin' OR 1=1 --", "admin'%20OR%201%3D1%20--"],
    ])(
      "encodes input safely for %s",
      async (_label, username, encodedUsername) => {
        fetchMock.mockResolvedValue(
          jsonResponse({
            success: true,
            message: "No duplicate email/username found.",
          }),
        );

        const result = await checkDuplicateUsername(username);

        expect(fetchMock).toHaveBeenCalledWith(
          `http://localhost:3001/auth/available?username=${encodedUsername}`,
        );
        expect(result.success).toBe(true);
      },
    );
  });

  describe("createUser", () => {
    it("sends JSON credentials and returns success payload", async () => {
      const credentials: RegisterUserData = {
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      };

      fetchMock.mockResolvedValue(
        jsonResponse({
          success: true,
          message: "Check your email to validate your account.",
        }),
      );

      const result = await createUser(credentials);

      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3001/auth/register",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }),
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe("Check your email to validate your account.");
    });

    it("returns API error payload for non-OK responses", async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          {
            success: false,
            error: "Username already registered",
          },
          409,
        ),
      );

      const result = await createUser({
        email: "test@example.com",
        username: "taken_user",
        password: "Password1!",
      });

      expect(result).toEqual({
        success: false,
        error: "Username already registered",
      });
    });

    it("returns fallback request error when non-OK response has no error payload", async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, 500));

      const result = await createUser({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });

      expect(result).toEqual({
        success: false,
        error: "Request failed.",
      });
    });

    it("returns network error when request throws", async () => {
      fetchMock.mockRejectedValue(new Error("network down"));

      const result = await createUser({
        email: "test@example.com",
        username: "valid_user",
        password: "Password1!",
      });

      expect(result).toEqual({
        success: false,
        error: "Network error",
      });
    });
  });
});
