import { render, screen, waitFor } from "@testing-library/react";
import { useActionState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RegisterEmail from "./RegisterEmail";

type MockLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

vi.mock("next/link", () => ({
  default: ({ href, children, className }: MockLinkProps) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

const mockedUseActionState = vi.mocked(useActionState);

describe("RegisterEmail", () => {
  beforeEach(() => {
    mockedUseActionState.mockReset();
  });

  it("renders server email errors", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: false,
        errors: {
          email: ["Invalid email"],
        },
      },
      vi.fn(),
      false,
    ] as never);

    render(<RegisterEmail email="" onSuccess={vi.fn()} />);

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("calls onSuccess when action succeeds", async () => {
    const onSuccess = vi.fn();

    mockedUseActionState.mockReturnValue([
      {
        success: true,
        email: "test@example.com",
      },
      vi.fn(),
      false,
    ] as never);

    render(<RegisterEmail email="" onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("test@example.com");
    });
  });
});
