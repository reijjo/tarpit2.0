import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RegisterPage from "./page";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("./_components/RegisterEmail", () => ({
  default: ({
    email,
    onSuccess,
  }: {
    email: string;
    onSuccess: (email: string) => void;
  }) => (
    <div>
      <p data-testid="step-1-email">{email}</p>
      <button type="button" onClick={() => onSuccess("saved@example.com")}>
        continue-to-step-2
      </button>
    </div>
  ),
}));

vi.mock("./_components/RegisterCredentials", () => ({
  default: ({ email, goBack }: { email: string; goBack: () => void }) => (
    <div>
      <p>credentials-step</p>
      <p data-testid="step-2-email">{email}</p>
      <button type="button" onClick={goBack}>
        go-back
      </button>
    </div>
  ),
}));

describe("RegisterPage", () => {
  it("moves from step 1 to step 2 and preserves email when going back", () => {
    render(<RegisterPage />);

    expect(screen.getByAltText("Penkit")).toBeInTheDocument();
    expect(screen.getByTestId("step-1-email")).toHaveTextContent("");

    fireEvent.click(screen.getByRole("button", { name: "continue-to-step-2" }));

    expect(screen.getByText("credentials-step")).toBeInTheDocument();
    expect(screen.getByTestId("step-2-email")).toHaveTextContent(
      "saved@example.com",
    );
    expect(screen.getByAltText("Tennis")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "go-back" }));

    expect(screen.getByTestId("step-1-email")).toHaveTextContent(
      "saved@example.com",
    );
    expect(screen.getByAltText("Penkit")).toBeInTheDocument();
  });
});
