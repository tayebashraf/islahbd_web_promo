import type { Metadata, Viewport } from "next";
// Fonts are self-hosted (no Google Fonts request at build or run time):
// Poppins for Latin, Kalpurush for Bangla (globals.css), Noto Naskh Arabic
// for Arabic UI, Noto Nastaliq Urdu for Urdu, Amiri for Quranic text.
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/noto-naskh-arabic/400.css";
import "@fontsource/noto-naskh-arabic/600.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { SmartAppBanner } from "@/components/smart-app-banner";
import { PlayerProvider } from "@/components/player/player-provider";

import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "islahbd", "ইসলামিক অ্যাপ", "মারকাজুল ইহসান", "নামাজের সময়", "কুরআন", "আমল", "হজ্জ গাইড", "দোয়া",
    "Islamic app Bangladesh", "prayer times", "Quran app", "islahbd app",
    "Markazul Ihsan", "ইসলাম", "মুসলিম অ্যাপ", "বাংলাদেশ ইসলামিক অ্যাপ",
  ],
  authors: [{ name: "Markazul Ihsan" }],
  creator: "islahbd",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "islahbd — Markazul Ihsan Islamic App" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon-192.png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFDF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0D0B" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LangProvider>
            <PlayerProvider>
              {children}
              <SmartAppBanner />
            </PlayerProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
