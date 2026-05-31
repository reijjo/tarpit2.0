import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MonthlyCard } from "./MonthlyCard";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: ({ tickFormatter }: { tickFormatter?: (value: number) => string }) => (
    <div data-testid="y-axis">{tickFormatter?.(45)}</div>
  ),
  Tooltip: ({
    content,
  }: {
    content?: (props: {
      active: boolean;
      payload?: Array<{ payload: { label: string; value: number } }>;
      label?: string;
    }) => React.ReactNode;
  }) => (
    <div data-testid="tooltip">
      {content?.({ active: false })}
      {content?.({
        active: true,
        payload: [{ payload: { label: "May", value: -30 } }],
        label: "May",
      })}
    </div>
  ),
  Bar: () => <div data-testid="bar" />,
}));

describe("MONTHLY CARD", () => {
  it("renders the monthly chart and tooltip content", () => {
    const { container } = render(<MonthlyCard />);

    expect(container.firstElementChild).toHaveClass("card", "monthly-card");
    expect(screen.getByRole("heading", { name: /monthly/i })).toBeInTheDocument();
    expect(screen.getByText("May")).toBeInTheDocument();
    expect(screen.getByText("-30€")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toHaveTextContent("+45€");
  });
});
