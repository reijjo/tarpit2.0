"use client";
import "./AppContent.css";
import { SIDEBAR_DESKTOP_QUERY } from "@/lib/constants/layout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { useSidebarBreakpointSync } from "./useSidebarBreakpoint";
import { useEffect } from "react";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

import Footer from "../footer/Footer";
import AppNavbar from "../navbar/AppNavbar";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  useSidebarBreakpointSync();

  const { close, isOpen } = useSidebarStore();
  const isDesktop = useMediaQuery(SIDEBAR_DESKTOP_QUERY);
  const shouldShowOverlay = isOpen && !isDesktop;

  useEffect(() => {
    if (!shouldShowOverlay) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldShowOverlay]);

  return (
    <div className="app-content">
      {isDesktop ? null : (
        <button
          aria-label="Close sidebar"
          className="app-sidebar-overlay"
          data-open={shouldShowOverlay}
          disabled={!shouldShowOverlay}
          type="button"
          onClick={close}
        />
      )}
      <Sidebar />
      <section className="app-main">
        <AppNavbar />
        {children}
        <Footer />
      </section>
    </div>
  );
}
