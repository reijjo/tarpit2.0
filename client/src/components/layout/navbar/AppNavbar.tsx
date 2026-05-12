"use client";
import "./AppNavbar.css";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button/Button";
import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";
import { useLogout } from "@/lib/hooks/useLogout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";

export default function AppNavbar() {
  const { isOpen, toggle } = useSidebarStore();
  const { logout, isPending, error } = useLogout();

  return (
    <nav className="app-navbar">
      <div className="app-nav-content wrapper">
        {!isOpen && (
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
          <Button variant="danger" onClick={logout} disabled={isPending}>
            logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
