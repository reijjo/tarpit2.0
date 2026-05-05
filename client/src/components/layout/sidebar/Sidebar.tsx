import "./Sidebar.css";
import { SIDEBAR_DESKTOP_QUERY } from "@/lib/constants/layout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { X } from "lucide-react";
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
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Profile</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Logout</a>
        </li>
      </ul>
    </div>
  );
}
