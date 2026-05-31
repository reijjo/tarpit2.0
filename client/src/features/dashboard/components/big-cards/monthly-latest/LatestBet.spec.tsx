import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Bet } from "@/features/bets/schemas";

import { LatestBet } from "./LatestBet";

function buildBet(
  overrides: Partial<Bet> & Pick<Bet, "status" | "stake" | "betFinalOdds">,
): Bet {
  return {
    id: 1,
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    stake: 5,
    bookmaker: "bet365",
    tipper: "john_doe",
    sport: "NHL",
    betFinalType: "single",
    betFinalOdds: 2.1,
    status: "pending",
    betDetails: [
      {
        id: 1,
        bet_id: 1,
        date: "2026-05-14",
        homeTeam: "Tampa Bay Lightning",
        awayTeam: "Boston Bruins",
        selection: "Tampa Bay Lightning",
        odds: 2.1,
        freeBet: false,
        liveBet: false,
        betType: "single",
      },
    ],
    ...overrides,
  };
}

describe("LATEST BET", () => {
  it("renders the pending return text", () => {
    const { container } = render(
      <LatestBet bet={buildBet({ status: "pending", stake: 5, betFinalOdds: 2.1 })} />,
    );

    expect(screen.getByText("2026-05-14")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveTextContent("5.00 €");
    expect(container.firstElementChild).toHaveTextContent("2.10");
    expect(container.firstElementChild).toHaveTextContent("pending");
    expect(screen.getAllByText("5.00 €")).toHaveLength(2);
  });

  it("renders the won return text", () => {
    render(<LatestBet bet={buildBet({ status: "won", stake: 2, betFinalOdds: 4 })} />);

    expect(screen.getByText("+ 8.00 €")).toBeInTheDocument();
    expect(screen.getByText("won")).toBeInTheDocument();
  });

  it("renders the lost return text", () => {
    render(
      <LatestBet bet={buildBet({ status: "lost", stake: 23.27, betFinalOdds: 1.9 })} />,
    );

    expect(screen.getByText("- 23.27 €")).toBeInTheDocument();
    expect(screen.getByText("lost")).toBeInTheDocument();
  });
});
