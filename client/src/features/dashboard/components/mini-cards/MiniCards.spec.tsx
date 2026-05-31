import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MiniCards } from "./MiniCards";

vi.mock("./MiniSummaryCard", () => ({
  MiniSummaryCard: ({
    label,
    value,
  }: {
    label: string;
    value: number | string;
  }) => (
    <div data-testid="mini-summary-card">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

describe("MINI CARDS", () => {
  it("renders the three summary cards", () => {
    render(<MiniCards />);

    expect(screen.getAllByTestId("mini-summary-card")).toHaveLength(3);
    expect(screen.getByText("total bets")).toBeInTheDocument();
    expect(screen.getByText("return %")).toBeInTheDocument();
    expect(screen.getByText("total profit")).toBeInTheDocument();
  });
});
