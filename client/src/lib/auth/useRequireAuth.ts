"use client";
import { clearAccessToken, getAccessToken } from "./tokenStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getMe } from "../api/auth";

export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      const token = getAccessToken();
      if (!token) return router.replace(redirectTo);

      const me = await getMe(token);

      console.log("me", me);

      if (!me.success) {
        clearAccessToken();
        return router.replace(redirectTo);
      }

      setReady(true);
    };

    run();
  }, [router, redirectTo]);

  return { ready };
}
