import HeroSection from "./HeroSection";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("HERO SECTION", () => {
  it("renders the hero section component", () => {
    render(<HeroSection />);

    const heroSectionElement = screen.getByRole("heading", {
      name: /track your bets online without/i,
    });
    expect(heroSectionElement).toBeInTheDocument();
  });
});
