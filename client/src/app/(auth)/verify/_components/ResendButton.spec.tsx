import { render, screen } from "@testing-library/react";
import { useActionState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ResendButton from "./ResendButton";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

const mockedUseActionState = vi.mocked(useActionState);

describe("RESEND BUTTON", () => {
  beforeEach(() => {
    mockedUseActionState.mockReset();
  });

  it("shows the default success message and hides the submit button", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: true,
      },
      vi.fn(),
      false,
    ] as never);

    const { container } = render(<ResendButton token="verify-token" />);

    expect(screen.getByText("Check your email.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /resend verification email/i }),
    ).not.toBeInTheDocument();
    expect(container.querySelector('input[name="token"]')).toHaveValue(
      "verify-token",
    );
  });

  it("shows the error message and submit button when not successful", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: false,
        error: "Invalid or expired token",
      },
      vi.fn(),
      false,
    ] as never);

    render(<ResendButton token="verify-token" />);

    expect(screen.getByText("Invalid or expired token")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /resend verification email/i }),
    ).toBeInTheDocument();
  });

  it("shows the pending state while submitting", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: false,
        error: "Invalid or expired token",
      },
      vi.fn(),
      true,
    ] as never);

    render(<ResendButton token="verify-token" />);

    expect(
      screen.getByRole("button", { name: /sending\.\.\./i }),
    ).toBeDisabled();
  });
});
