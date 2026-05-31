import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MonthlyLatestCards } from "./MonthlyLatestCards";

vi.mock("./monthly-latest/MonthlyCard", () => ({
  MonthlyCard: () => <div data-testid="monthly-card" />,
}));

vi.mock("./monthly-latest/LatestCard", () => ({
  LatestCard: () => <div data-testid="latest-card" />,
}));

describe("MONTHLY LATEST CARDS", () => {
  it("renders the monthly and latest cards", () => {
    const { container } = render(<MonthlyLatestCards />);

    expect(
      container.querySelector(".dash-monthly-latest-cards"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("monthly-card")).toBeInTheDocument();
    expect(screen.getByTestId("latest-card")).toBeInTheDocument();
  });
});
