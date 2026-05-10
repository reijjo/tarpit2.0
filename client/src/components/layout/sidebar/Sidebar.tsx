import "./Sidebar.css";
import { SIDEBAR_DESKTOP_QUERY } from "@/lib/constants/layout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { LayoutDashboard, X, User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "react";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

import { Button } from "@/components/ui/button/Button";

export default function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const isDesktop = useMediaQuery(SIDEBAR_DESKTOP_QUERY);
  const isMobileOpen = !isDesktop && isOpen;

  return (
    <div className="sidebar" data-open={isMobileOpen}>
      <div className="sidebar-top">
        <Link href="/dash" className="sidebar-logo">
          <Image
            src="/icons/fishing.png"
            alt="logo"
            height={28}
            width={28}
            loading="eager"
          />
          Tärpit
        </Link>
        <Activity mode={isDesktop ? "hidden" : "visible"}>
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </Button>
        </Activity>
      </div>
      <ul className="sidebar-links-list">
        <li>
          <LayoutDashboard size={18} />
          <a href="#">Dashboard</a>
        </li>
        <li>
          <User size={18} />
          <a href="#">Profile</a>
        </li>
        <li>
          <Settings size={18} />
          <a href="#">Settings</a>
        </li>
        <li>
          <LogOut size={18} />
          <a href="#">Logout</a>
        </li>
      </ul>
    </div>
  );
}
