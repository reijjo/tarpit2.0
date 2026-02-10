import { Button } from "./Button";
import { LinkButton } from "./LinkButton";
import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";

describe("BUTTON", () => {
  describe("Button component", () => {
    it("renders the Button component with default props", () => {
      render(<Button>Click Me</Button>);

      const buttonElement = screen.getByRole("button", { name: "Click Me" });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveClass("btn--primary");
      expect(buttonElement).toHaveClass("btn--md");
    });
  });

  describe("LinkButton component", () => {
    it("renders the LinkButton component with default props", () => {
      render(<LinkButton href="/test">Go to Test</LinkButton>);

      const linkElement = screen.getByRole("link", { name: "Go to Test" });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveClass("btn--primary");
      expect(linkElement).toHaveClass("btn--md");
    });
  });
});
