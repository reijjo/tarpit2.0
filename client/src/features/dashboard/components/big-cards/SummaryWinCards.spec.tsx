import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SummaryWinCards } from "./SummaryWinCards";

vi.mock("./summary-win/SummaryCard", () => ({
  SummaryCard: () => <div data-testid="summary-card" />,
}));

vi.mock("./summary-win/WinCard", () => ({
  WinCard: () => <div data-testid="win-card" />,
}));

describe("SUMMARY WIN CARDS", () => {
  it("renders the summary and win cards", () => {
    const { container } = render(<SummaryWinCards />);

    expect(
      container.querySelector(".dash-summary-win-cards"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("summary-card")).toBeInTheDocument();
    expect(screen.getByTestId("win-card")).toBeInTheDocument();
  });
});
