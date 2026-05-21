"use client";
import "./AppNavbar.css";
import { SIDEBAR_DESKTOP_QUERY } from "@/lib/constants/layout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { Menu } from "lucide-react";

import { useLogout } from "@/lib/hooks/useLogout";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

import { Button } from "@/components/ui/button/Button";
import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";

export default function AppNavbar() {
  const { isOpen, toggle } = useSidebarStore();
  const { logout, isPending, error } = useLogout();
  const isDesktop = useMediaQuery(SIDEBAR_DESKTOP_QUERY);

  return (
    <nav className="app-navbar">
      <div className="app-nav-content wrapper">
        {!isDesktop && !isOpen && (
          <div className="app-nav-toggle">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={toggle}
            >
              <Menu size={20} />
            </Button>
          </div>
        )}
        <div className="app-nav-buttons">
          {error && <FormErrorMessage message={error} />}
          <Button
            size="sm"
            variant="danger"
            onClick={logout}
            disabled={isPending}
          >
            logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
