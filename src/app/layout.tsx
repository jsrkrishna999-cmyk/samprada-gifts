import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
  // Lets every page use relative og:image paths — Next resolves them against
  // this, and share crawlers require absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Samprada Gifts | Premium Traditional Return Gifts",
    template: "%s | Samprada Gifts",
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: SITE_URL,
    title: "Samprada Gifts | Premium Traditional Return Gifts",
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samprada Gifts | Premium Traditional Return Gifts",
    description: SITE_DESCRIPTION,
    images: ["/og-default.jpg"],
  },
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
