import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Samprada Gifts | Premium Traditional Return Gifts",
    template: "%s | Samprada Gifts",
  },
  description:
    "Premium, tradition-rooted Haldi Kumkum return gifts for weddings, Varalakshmi Vratham, Gruhapravesam, baby showers, and festive celebrations across India.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#7a1f38",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream text-brown-700 antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
