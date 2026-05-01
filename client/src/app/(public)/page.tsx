import { getMe } from "@/lib/auth/getMe";
import { redirect } from "next/navigation";

import Features from "./_components/Features";
import HeroSection from "./_components/HeroSection";

export default async function Home() {
  const me = await getMe();
  if (me.success) redirect("/dash");

  return (
    <main className="home-page">
      <HeroSection />
      <Features />
    </main>
  );
}
