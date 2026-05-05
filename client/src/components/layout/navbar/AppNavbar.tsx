"use client";
import "./AppNavbar.css";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button/Button";

export default function AppNavbar() {
  const { isOpen } = useSidebarStore();

  return (
    <nav className="app-navbar">
      <div className="app-nav-content wrapper">
        {!isOpen && (
          <div className="app-nav-toggle">
            <Button variant="outline" size="icon" type="button">
              <Menu size={20} />
            </Button>
          </div>
        )}
        <div className="">
          <button>logout</button>
        </div>
      </div>
    </nav>
  );
}
