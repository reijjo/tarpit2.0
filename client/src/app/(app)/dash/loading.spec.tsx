import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingDashboard from "./loading";

describe("DASH LOADING", () => {
  it("renders the dashboard loading text", () => {
    render(<LoadingDashboard />);

    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });
});
