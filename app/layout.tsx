import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://1118.io"),
  title: "1118 — We build things that deserve to exist.",
  description:
    "1118 builds the software we keep looking for—original products made with care, clarity, and conviction.",
  openGraph: {
    title: "1118 — We build things that deserve to exist.",
    description:
      "Original products made with care, clarity, and conviction.",
    type: "website",
    url: "https://1118.io",
  },
  icons: {
    icon: "/brand/1118-logo-blue.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
