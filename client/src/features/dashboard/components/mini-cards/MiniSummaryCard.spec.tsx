import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MiniSummaryCard } from "./MiniSummaryCard";

function TestIcon({ size }: { size: number }) {
  return <svg data-testid="mini-icon" data-size={size} />;
}

describe("MINI SUMMARY CARD", () => {
  it("renders the icon, value, and label", () => {
    render(<MiniSummaryCard icon={TestIcon as never} value={203} label="total bets" />);

    expect(screen.getByTestId("mini-icon")).toHaveAttribute("data-size", "40");
    expect(screen.getByRole("heading", { name: "203" })).toBeInTheDocument();
    expect(screen.getByText("total bets")).toBeInTheDocument();
  });
});
