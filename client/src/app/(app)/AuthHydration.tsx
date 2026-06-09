"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import type { MeData } from "@/lib/types/userTypes";
import { useEffect } from "react";

type AuthHydrationProps = {
  me: MeData;
};

export function AuthHydration({ me }: AuthHydrationProps) {
  const setMe = useAuthStore((state) => state.setMe);

  useEffect(() => {
    setMe(me);
  }, [me, setMe]);

  return null;
}
