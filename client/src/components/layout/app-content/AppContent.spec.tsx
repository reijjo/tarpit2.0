// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AppContent from "./AppContent";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useSidebarStore } from "@/lib/stores/sidebarStore";

vi.mock("./useSidebarBreakpoint", () => ({
  useSidebarBreakpointSync: vi.fn(),
}));

vi.mock("@/components/layout/footer/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock("@/components/layout/navbar/AppNavbar", () => ({
  default: () => <header data-testid="navbar" />,
}));

vi.mock("@/components/layout/sidebar/Sidebar", () => ({
  default: () => <aside data-testid="sidebar" />,
}));

vi.mock("@/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: vi.fn(),
}));

vi.mock("@/lib/stores/sidebarStore", () => ({
  useSidebarStore: vi.fn(),
}));

describe("APP CONTENT", () => {
  const close = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  it("renders a scrim and locks scroll on mobile when the sidebar is open", () => {
    vi.mocked(useMediaQuery).mockReturnValue(false);
    vi.mocked(useSidebarStore).mockReturnValue({
      close,
      isOpen: true,
      open: vi.fn(),
      toggle: vi.fn(),
    });

    const { unmount } = render(
      <AppContent>
        <div>content</div>
      </AppContent>,
    );

    expect(
      screen.getByRole("button", { name: /close sidebar/i }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: /close sidebar/i }));

    expect(close).toHaveBeenCalledTimes(1);

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("keeps the scrim mounted but inactive on mobile when the sidebar is closed", () => {
    vi.mocked(useMediaQuery).mockReturnValue(false);
    vi.mocked(useSidebarStore).mockReturnValue({
      close,
      isOpen: false,
      open: vi.fn(),
      toggle: vi.fn(),
    });

    render(
      <AppContent>
        <div>content</div>
      </AppContent>,
    );

    expect(
      screen.getByRole("button", { name: /close sidebar/i }),
    ).toBeDisabled();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not render the scrim on desktop", () => {
    vi.mocked(useMediaQuery).mockReturnValue(true);
    vi.mocked(useSidebarStore).mockReturnValue({
      close,
      isOpen: true,
      open: vi.fn(),
      toggle: vi.fn(),
    });

    render(
      <AppContent>
        <div>content</div>
      </AppContent>,
    );

    expect(
      screen.queryByRole("button", { name: /close sidebar/i }),
    ).not.toBeInTheDocument();
  });
});
