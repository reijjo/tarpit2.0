import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("DIVIDER", () => {
  it("renders the default divider styles", () => {
    const { container } = render(<Divider />);

    expect(container.firstElementChild).toHaveClass("divider");
    expect(container.firstElementChild).toHaveAttribute(
      "style",
      "border-top: 1px solid var(--primary-500); width: 100%;",
    );
  });

  it("renders custom divider styles", () => {
    const { container } = render(
      <Divider color="red" thickness={3} width={42} />,
    );

    expect(container.firstElementChild).toHaveAttribute(
      "style",
      "border-top: 3px solid red; width: 42%;",
    );
  });
});
