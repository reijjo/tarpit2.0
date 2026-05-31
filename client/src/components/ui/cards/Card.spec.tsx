import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("CARD", () => {
  it("renders children and forwards props", () => {
    const { container } = render(
      <Card className="custom-card" data-testid="card" role="region">
        Content
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("card", "custom-card");
    expect(screen.getByRole("region")).toHaveTextContent("Content");
    expect(container.firstElementChild).toHaveClass("card", "custom-card");
  });
});
