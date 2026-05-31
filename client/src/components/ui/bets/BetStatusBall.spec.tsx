import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BetStatusBall } from "./BetStatusBall";

describe("BET STATUS BALL", () => {
  it("renders the status class for a winning bet", () => {
    const { container } = render(<BetStatusBall status="won" />);

    expect(container.firstElementChild).toHaveClass(
      "bet-status-ball",
      "bet-ball-won",
    );
  });
});
