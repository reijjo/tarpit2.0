import "./layout.css";
import { getMe } from "@/lib/auth/getMe";
import { redirect } from "next/navigation";

import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/navbar/Navbar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getMe();
  if (me.success) redirect("/dash");

  return (
    <main className="auth-layout">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
