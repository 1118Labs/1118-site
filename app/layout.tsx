import "./globals.css";
import "./scene-one.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://1118.io"),
  title: "1118 — AI-first product studio",
  description:
    "1118 designs, builds, and launches original software products—from first principle to finished product.",
  openGraph: {
    title: "1118 — AI-first product studio",
    description:
      "We build the software we keep looking for. Original products. Real companies.",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
