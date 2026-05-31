import { Loading } from "./Loading";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("LOADING.TSX", () => {
  it("Renders Loading", () => {
    render(<Loading />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});
