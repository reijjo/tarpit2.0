import { vi } from "vitest";

export type SidebarStoreMock = {
  isOpen: boolean;
  toggle: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  open: ReturnType<typeof vi.fn>;
};

export type LogoutMock = {
  logout: ReturnType<typeof vi.fn>;
  isPending: boolean;
  error: string | null;
};

export function createSidebarStoreMock(
  overrides: Partial<SidebarStoreMock> = {},
): SidebarStoreMock {
  return {
    isOpen: false,
    toggle: vi.fn(),
    close: vi.fn(),
    open: vi.fn(),
    ...overrides,
  };
}

export function createLogoutMock(
  overrides: Partial<LogoutMock> = {},
): LogoutMock {
  return {
    logout: vi.fn(),
    isPending: false,
    error: null,
    ...overrides,
  };
}
