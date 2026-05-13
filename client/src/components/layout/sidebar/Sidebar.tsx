import "./Sidebar.css";
import { SIDEBAR_DESKTOP_QUERY } from "@/lib/constants/layout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import {
  LayoutDashboard,
  X,
  User,
  LogOut,
  SquarePen,
  ChartColumn,
  Landmark,
  ListChecks,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "react";

import { useLogout } from "@/lib/hooks/useLogout";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

import { Button } from "@/components/ui/button/Button";

// import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";

export default function Sidebar() {
  const { isOpen, toggle, close } = useSidebarStore();
  const isDesktop = useMediaQuery(SIDEBAR_DESKTOP_QUERY);
  const isMobileOpen = !isDesktop && isOpen;
  const { logout, isPending, error } = useLogout();

  console.log("logout error", error);

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
          <Link href="/dash" onClick={close}>
            Dashboard
          </Link>
        </li>
        <li>
          <ChartColumn size={18} />
          <Link href="/analytics" onClick={close}>
            Analytics
          </Link>
        </li>
        <li>
          <Landmark size={18} />
          <Link href="/deposit" onClick={close}>
            Deposit/Withdraw
          </Link>
        </li>
        <li>
          <SquarePen size={18} />
          <Link href="/add" onClick={close}>
            Add Bet
          </Link>
        </li>
        <li>
          <ListChecks size={18} />
          <Link href="/bets" onClick={close}>
            Bets
          </Link>
        </li>
        <li>
          <User size={18} />
          <Link href="/profile" onClick={close}>
            Profile
          </Link>
        </li>
        {/*{error && (
          <li className="sidebar-logout-error">
            <FormErrorMessage message={error} />
          </li>
        )}*/}
        <li>
          <LogOut size={18} />
          <button onClick={logout} disabled={isPending}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
