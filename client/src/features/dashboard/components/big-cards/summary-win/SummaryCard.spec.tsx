import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SummaryCard } from "./SummaryCard";

describe("SUMMARY CARD", () => {
  it("renders the summary table", () => {
    render(<SummaryCard />);

    expect(screen.getByRole("heading", { name: /summary/i })).toBeInTheDocument();
    expect(screen.getByText("at risk")).toBeInTheDocument();
    expect(screen.getByText("profit/loss")).toBeInTheDocument();
    expect(screen.getByText("total bets")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("last 7 days")).toBeInTheDocument();
    expect(screen.getByText("last 30 days")).toBeInTheDocument();
  });
});
