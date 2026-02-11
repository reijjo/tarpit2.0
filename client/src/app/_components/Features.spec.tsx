import Features from "./Features";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("FEATURES", () => {
  it("dashboard features", () => {
    render(<Features />);

    const dashboardFeatureElement = screen.getByText(
      /shows a recap of your betting/i,
    );
    expect(dashboardFeatureElement).toBeInTheDocument();
  });

  it("add bet features", () => {
    render(<Features />);

    const addBetFeatureElement = screen.getByText(/you can also add/i);
    expect(addBetFeatureElement).toBeInTheDocument();
  });
});
