import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LatestCard } from "./LatestCard";

vi.mock("./LatestBet", () => ({
  LatestBet: ({ bet }: { bet: { id: number } }) => (
    <div data-testid="latest-bet">{bet.id}</div>
  ),
}));

describe("LATEST CARD", () => {
  it("renders the latest bet placeholders", () => {
    render(<LatestCard />);

    expect(screen.getByRole("heading", { name: /latest bets/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("latest-bet")).toHaveLength(3);
  });
});
