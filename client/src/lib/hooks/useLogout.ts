"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { loggingOut } from "@/features/auth/api";

export function useLogout() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsPending(true);
    setError(null);

    try {
      const result = await loggingOut();
      if (result.success) {
        router.replace("/");
        return;
      }

      setError(result.error ?? "Logout failed.");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return { logout, isPending, error };
}
