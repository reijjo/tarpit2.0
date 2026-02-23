import Features from "./_components/Features";
import HeroSection from "./_components/HeroSection";

export default function Home() {
  console.log("NODE_ENV", process.env.NODE_ENV);
  return (
    <main className="home-page">
      <HeroSection />
      <Features />
    </main>
  );
}
