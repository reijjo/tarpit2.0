import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogout } from "@/lib/hooks/useLogout";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import {
  createLogoutMock,
  createSidebarStoreMock,
} from "@/test/utils/layoutMocks";

import Sidebar from "./Sidebar";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
    >
      {children}
    </a>
  ),
}));

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

describe("SIDEBAR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the mobile sidebar with the close button and logout state", () => {
    const close = vi.fn();
    const toggle = vi.fn();
    const logout = vi.fn();

    mockedUseSidebarStore.mockReturnValue(
      createSidebarStoreMock({
        isOpen: true,
        close,
        toggle,
      }),
    );
    mockedUseLogout.mockReturnValue(
      createLogoutMock({
        logout,
        isPending: true,
      }),
    );
    mockedUseMediaQuery.mockReturnValue(false);

    const { container } = render(<Sidebar />);

    expect(container.firstElementChild).toHaveAttribute("data-open", "true");
    expect(
      screen.getByRole("button", { name: /close sidebar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /logo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeDisabled();

    screen.getByRole("link", { name: /dashboard/i }).click();
    screen.getByRole("button", { name: /close sidebar/i }).click();

    expect(close).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(logout).not.toHaveBeenCalled();
  });

  it("hides the close button on desktop", () => {
    const logout = vi.fn();

    mockedUseSidebarStore.mockReturnValue(
      createSidebarStoreMock({
        isOpen: false,
      }),
    );
    mockedUseLogout.mockReturnValue(
      createLogoutMock({
        logout,
      }),
    );
    mockedUseMediaQuery.mockReturnValue(true);

    const { container } = render(<Sidebar />);

    expect(container.firstElementChild).toHaveAttribute("data-open", "false");
    expect(
      screen.queryByRole("button", { name: /close sidebar/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeEnabled();
    screen.getByRole("button", { name: /logout/i }).click();
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
