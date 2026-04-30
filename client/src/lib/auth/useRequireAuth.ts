"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getMe } from "@/lib/api/auth";

export function useRequireAuth(redirectTo = "/login") {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      const me = await getMe();

      if (!me.success) {
        router.replace(redirectTo);
        return;
      }

      setReady(true);
    };

    run();
  }, [router, redirectTo]);

  return { ready };
}
