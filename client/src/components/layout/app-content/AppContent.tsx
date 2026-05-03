"use client";
import "./AppContent.css";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { Activity, useEffect } from "react";

import Sidebar from "@/components/layout/sidebar/Sidebar";

import Footer from "../footer/Footer";
import AppNavbar from "../navbar/AppNavbar";

export default function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, close, isOpen } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1250) open();
      else close();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [close, open]);

  return (
    <div className="app-content">
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <Sidebar />
      </Activity>
      <section className="app-main">
        <AppNavbar />
        {children}
        <Footer />
      </section>
    </div>
  );
}
