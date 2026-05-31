import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { verifyAccount } from "@/features/auth/api";

import VerifyContent from "./VerifyContent";

vi.mock("@/features/auth/api", () => ({
  verifyAccount: vi.fn(),
}));

vi.mock("@/components/ui/button/LinkButton", () => ({
  LinkButton: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("./ResendButton", () => ({
  default: ({ token }: { token: string }) => (
    <div data-testid="resend-button">{token}</div>
  ),
}));

const mockedVerifyAccount = vi.mocked(verifyAccount);

describe("VERIFY CONTENT", () => {
  beforeEach(() => {
    mockedVerifyAccount.mockReset();
  });

  it("renders the success state when verification succeeds", async () => {
    mockedVerifyAccount.mockResolvedValue({
      success: true,
    } as never);

    render(await VerifyContent({ token: "verify-token" }));

    expect(screen.getByRole("heading", { name: /all good!/i })).toBeInTheDocument();
    expect(
      screen.getByText(/you can now log in with your email\/username/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to login/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("renders the conflict state with the login link", async () => {
    mockedVerifyAccount.mockResolvedValue({
      success: false,
      status: 409,
      error: "Already verified",
    } as never);

    render(await VerifyContent({ token: "verify-token" }));

    expect(screen.getByRole("heading", { name: /all good!/i })).toBeInTheDocument();
    expect(screen.getByText("Already verified")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to login/i })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.queryByTestId("resend-button")).not.toBeInTheDocument();
  });

  it("renders the resend flow when the token is expired", async () => {
    mockedVerifyAccount.mockResolvedValue({
      success: false,
      status: 410,
      error: "Token expired",
    } as never);

    render(await VerifyContent({ token: "verify-token" }));

    expect(
      screen.getByRole("heading", { name: /verification failed/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Token expired")).toBeInTheDocument();
    expect(screen.getByTestId("resend-button")).toHaveTextContent("verify-token");
    expect(screen.queryByRole("link", { name: /go to login/i })).not.toBeInTheDocument();
  });
});
