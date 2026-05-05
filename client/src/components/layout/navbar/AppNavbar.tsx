"use client";
import "./AppNavbar.css";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loggingOut } from "@/lib/api/auth";

import { Button } from "@/components/ui/button/Button";
import { FormErrorMessage } from "@/components/ui/messages/FormErrorMessage";

export default function AppNavbar() {
  const { isOpen, toggle } = useSidebarStore();

  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      const result = await loggingOut();
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Logout failed");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <nav className="app-navbar">
      <div className="app-nav-content wrapper">
        {!isOpen && (
          <div className="app-nav-toggle">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={toggle}
            >
              <Menu size={20} />
            </Button>
          </div>
        )}
        <div className="app-nav-buttons">
          {error && <FormErrorMessage message={error} />}
          <Button variant="outline" onClick={handleLogout} disabled={isPending}>
            logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
