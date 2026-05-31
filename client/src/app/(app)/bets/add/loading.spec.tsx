import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingAddBet from "./loading";

describe("ADD BET LOADING", () => {
  it("renders the add bet loading text", () => {
    render(<LoadingAddBet />);

    expect(screen.getByText(/loading add bet page/i)).toBeInTheDocument();
  });
});
