import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogout } from "@/lib/hooks/useLogout";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import {
  createLogoutMock,
  createSidebarStoreMock,
} from "@/test/utils/layoutMocks";

import AppNavbar from "./AppNavbar";

vi.mock("@/lib/hooks/useLogout", () => ({
  useLogout: vi.fn(),
}));

vi.mock("@/lib/hooks/useMediaQuery", () => ({
  useMediaQuery: vi.fn(),
}));

vi.mock("@/lib/stores/sidebarStore", () => ({
  useSidebarStore: vi.fn(),
}));

const mockedUseLogout = vi.mocked(useLogout);
const mockedUseMediaQuery = vi.mocked(useMediaQuery);
const mockedUseSidebarStore = vi.mocked(useSidebarStore);

describe("APP NAVBAR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the sidebar toggle on mobile when the sidebar is closed", () => {
    mockedUseSidebarStore.mockReturnValue(createSidebarStoreMock());
    mockedUseLogout.mockReturnValue(createLogoutMock());
    mockedUseMediaQuery.mockReturnValue(false);

    render(<AppNavbar />);

    expect(screen.getByRole("button", { name: /logout/i })).toBeEnabled();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("hides the sidebar toggle and shows logout errors on desktop", () => {
    mockedUseSidebarStore.mockReturnValue(
      createSidebarStoreMock({
        isOpen: true,
      }),
    );
    mockedUseLogout.mockReturnValue(
      createLogoutMock({
        error: "Logout failed.",
        isPending: true,
      }),
    );
    mockedUseMediaQuery.mockReturnValue(true);

    const { container } = render(<AppNavbar />);

    expect(container.querySelector(".app-nav-toggle")).toBeNull();
    expect(screen.getByRole("alert")).toHaveTextContent("Logout failed.");
    expect(screen.getByRole("button", { name: /logout/i })).toBeDisabled();
  });
});
