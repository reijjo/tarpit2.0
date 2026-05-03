import "./layout.css";
import { getMe } from "@/lib/auth/getMe";
import { redirect } from "next/navigation";

import AppContent from "@/components/layout/app-content/AppContent";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();

  console.log("AppLayout - getMe response:", me);

  if (!me.success) {
    return redirect("/login");
  }

  return (
    <main className="app-layout">
      <AppContent>{children}</AppContent>
    </main>
  );
}
