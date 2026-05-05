import { render, screen, waitFor } from "@testing-library/react";
import { useActionState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Login from "./Login";

type MockLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, className }: MockLinkProps) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

const mockedUseActionState = vi.mocked(useActionState);

describe("Login", () => {
  beforeEach(() => {
    mockedUseActionState.mockReset();
    pushMock.mockReset();
  });

  it("redirects to the dashboard when the action succeeds", async () => {
    mockedUseActionState.mockReturnValue([
      {
        success: true,
      },
      vi.fn(),
      false,
    ] as never);

    render(<Login />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dash");
    });
  });

  it("renders server error state from the login action", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: false,
        error: "Invalid credentials",
      },
      vi.fn(),
      false,
    ] as never);

    render(<Login />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("shows the pending submit state while logging in", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: false,
      },
      vi.fn(),
      true,
    ] as never);

    render(<Login />);

    expect(
      screen.getByRole("button", { name: /logging in\.\.\./i }),
    ).toBeDisabled();
  });
});
