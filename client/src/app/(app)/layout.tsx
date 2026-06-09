import { AuthHydration } from "./AuthHydration";
import "./layout.css";
import { getMe } from "@/lib/auth/getMe";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import AppContent from "@/components/layout/app-content/AppContent";

import { Loading } from "@/components/ui/fallback/Loading";

export const dynamic = "force-dynamic"; // ← add this

async function ProtectedApp({ children }: { children: React.ReactNode }) {
  let me: Awaited<ReturnType<typeof getMe>>;

  try {
    me = await getMe();
  } catch (err) {
    console.log("me error: ", err);
    redirect("/login");
  }

  console.log("ME?: ", me);

  if (!me.success || !me.data) {
    redirect("/login");
  }

  return (
    <>
      <AuthHydration me={me.data} />
      <AppContent>{children}</AppContent>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-layout">
      <Suspense
        fallback={
          <div className="app-loading-screen">
            <Loading text="Loading app" />
          </div>
        }
      >
        <ProtectedApp>{children}</ProtectedApp>
      </Suspense>
    </main>
  );
}
