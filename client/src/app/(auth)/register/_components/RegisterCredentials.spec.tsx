import { fireEvent, render, screen } from "@testing-library/react";
import { useActionState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RegisterCredentials from "./RegisterCredentials";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

const mockedUseActionState = vi.mocked(useActionState);

describe("RegisterCredentials", () => {
  beforeEach(() => {
    mockedUseActionState.mockReset();
  });

  it("renders username and password errors from action state", () => {
    mockedUseActionState.mockReturnValue([
      {
        success: false,
        errors: {
          username: ["Min 3 characters on username"],
          password: ["Min 8 characters"],
        },
        username: "ab",
        password: "",
      },
      vi.fn(),
      false,
    ] as never);

    const { container } = render(
      <RegisterCredentials email="test@example.com" goBack={vi.fn()} />,
    );

    expect(screen.getByText("Min 3 characters on username")).toBeInTheDocument();
    expect(screen.getByText("Min 8 characters")).toBeInTheDocument();

    const hiddenEmailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement | null;

    expect(hiddenEmailInput).toBeInTheDocument();
    expect(hiddenEmailInput?.value).toBe("test@example.com");
  });

  it("calls goBack when clicking the back button", () => {
    const goBack = vi.fn();

    mockedUseActionState.mockReturnValue([
      {
        success: false,
      },
      vi.fn(),
      false,
    ] as never);

    render(<RegisterCredentials email="test@example.com" goBack={goBack} />);

    fireEvent.click(screen.getByRole("button", { name: /go back/i }));

    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
