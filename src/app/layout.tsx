import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import LogoMark from "@/app/assets/logo.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pratipal | Healing & Wellness Store",
  description:
    "Discover crystal-infused healing candles, therapeutic essential oil roll-ons, and energy intention salts crafted with love and intention.",
  icons: {
    icon: LogoMark.src,
    shortcut: LogoMark.src,
    apple: LogoMark.src,
  },
  openGraph: {
    title: "Pratipal | Healing & Wellness Store",
    description:
      "Discover crystal-infused healing candles, therapeutic essential oil roll-ons, and energy intention salts crafted with love and intention.",
    images: [LogoMark.src],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
