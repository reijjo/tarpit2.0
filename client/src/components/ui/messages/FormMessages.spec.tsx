import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormErrorMessage } from "./FormErrorMessage";
import { FormSuccessMessage } from "./FormSuccessMessage";

describe("FormMessages", () => {
  it("renders error text safely as plain content", () => {
    const message = "<script>alert(1)</script>";

    const { container } = render(<FormErrorMessage message={message} />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders success text safely as plain content", () => {
    const message = '<img src=x onerror="alert(1)">';

    const { container } = render(<FormSuccessMessage message={message} />);

    expect(screen.getByRole("alert")).toHaveTextContent(message);
    expect(container.querySelector("img")).toBeNull();
  });
});
