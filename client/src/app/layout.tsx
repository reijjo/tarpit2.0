import "./common.css";
import "./globals.css";
import "./layout.css";
import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tärpit",
  description: "Track your bets without annoying Excel sheets",
  icons: {
    icon: "/icons/fishing.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
