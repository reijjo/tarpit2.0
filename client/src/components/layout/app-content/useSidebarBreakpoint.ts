"use client";

import { SIDEBAR_DESKTOP_QUERY } from "@/lib/constants/layout";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { useEffect } from "react";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

export function useSidebarBreakpointSync() {
  const isDesktop = useMediaQuery(SIDEBAR_DESKTOP_QUERY);
  const { open, close } = useSidebarStore();

  useEffect(() => {
    if (isDesktop) open();
    else close();
  }, [isDesktop, open, close]);
}
