import Navbar from "./Navbar";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("NAVBAR", () => {
  describe("BASIC NAVBAR", () => {
    it("renders the navbar component", () => {
      render(<Navbar />);

      const navButtons = screen.getAllByRole("link");
      expect(navButtons).toHaveLength(3);
    });
  });
});
