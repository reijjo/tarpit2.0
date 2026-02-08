import Footer from "./Footer";
import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";

describe("FOOTER", () => {
  it("renders the footer component", () => {
    render(<Footer />);

    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
  });
});
