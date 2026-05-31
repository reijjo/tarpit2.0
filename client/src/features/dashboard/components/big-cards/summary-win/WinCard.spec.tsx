import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WinCard } from "./WinCard";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    data,
    shape,
  }: {
    data: Array<{ fill: string }>;
    shape?: (props: {
      cx: string;
      cy: string;
      innerRadius: number;
      outerRadius: number;
      startAngle: number;
      endAngle: number;
      fill: string;
    }) => React.ReactNode;
  }) => (
    <div data-testid="pie">
      {shape?.({
        cx: "50%",
        cy: "50%",
        innerRadius: 20,
        outerRadius: 40,
        startAngle: 90,
        endAngle: -270,
        fill: data[0]?.fill ?? "var(--success-light)",
      })}
    </div>
  ),
  Sector: ({ fill }: { fill: string }) => (
    <div data-testid="sector" data-fill={fill} />
  ),
}));

describe("WIN CARD", () => {
  it("renders the default summary chart", () => {
    render(<WinCard />);

    expect(screen.getByRole("heading", { name: /win %/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/bet result distribution/i)).toBeInTheDocument();
    expect(screen.getByText("Won")).toBeInTheDocument();
    expect(screen.getByText("56.5%")).toBeInTheDocument();
    expect(screen.getByTestId("sector")).toHaveAttribute(
      "data-fill",
      "var(--success-light)",
    );
  });

  it("renders the empty state when there are no settled bets", () => {
    render(<WinCard summary={{ won: 0, lost: 0, void: 0 }} />);

    expect(screen.getByText("No settled bets yet")).toBeInTheDocument();
    expect(screen.queryByTestId("pie")).not.toBeInTheDocument();
  });
});
