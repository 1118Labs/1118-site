import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://1118.io"),
  title: {
    default: "1118 — Original digital products",
    template: "%s | 1118",
  },
  description:
    "1118 builds and operates original digital products, including Etchr Portraits—live on the App Store.",
  applicationName: "1118",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "1118",
    title: "1118 — Original digital products",
    description:
      "1118 builds and operates original digital products, including Etchr Portraits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "1118 — Original digital products",
    description:
      "1118 builds and operates original digital products, including Etchr Portraits.",
  },
  robots: isProduction
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        noarchive: true,
      },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf8f2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
