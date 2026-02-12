import Features from "./Features";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("FEATURES", () => {
  it("renders dashboard features", () => {
    render(<Features />);

    const dashboardFeatureElement = screen.getByText(
      /shows a recap of your betting/i,
    );
    expect(dashboardFeatureElement).toBeInTheDocument();
  });

  it("renders add bet features", () => {
    render(<Features />);

    const addBetFeatureElement = screen.getByText(/you can also add/i);
    expect(addBetFeatureElement).toBeInTheDocument();
  });

  it("renders why register boxes", () => {
    render(<Features />);

    expect(screen.getByText(/why you should register/i)).toBeInTheDocument();
    expect(screen.getByText(/keep track of your bets/i)).toBeInTheDocument();
    expect(
      screen.getByText(/analytics improves your betting/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you learn your betting strengths/i),
    ).toBeInTheDocument();
  });
});
