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
import { GlobalJsonLd } from "@/components/seo/json-ld";

import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী | মারকাযুল ইহসান`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "islahbd", "মারকাযুল ইহসান", "মারকাজুল ইহসান", "ইসলামিক অ্যাপ বাংলাদেশ",
    "বয়ান", "বাংলা ওয়াজ", "নতুন ওয়াজ ২০২৬", "ইসলামিক বয়ান", "আত্মশুদ্ধিকারী বয়ান",
    "মাওলানা তৈয়্যেব আশরাফ", "জুমার খুতবা", "নসীহত", "ইসলাহী বয়ান",
    "ইসলামিক গজল", "বাংলা গজল", "নতুন গজল ২০২৬", "হামদ ও নাত", "নাত এ রাসুল", "নাশিদ",
    "নামাজের সময়সূচী", "পাঁচ ওয়াক্ত নামাজের সময়", "আজকের নামাজের সময় ঢাকা", "চিরস্থায়ী নামাজের ক্যালেন্ডার",
    "আল কুরআন বাংলা অনুবাদ", "কুরআন শরীফ", "৩০ পারা কুরআন", "হাফেজী কুরআন শরীফ", "কুরআন তেলাওয়াত mp3",
    "হিসনুল মুসলিম বাংলা", "প্রতিদিনের দোয়া", "সকাল সন্ধ্যার দোয়া", "বিপদ মুক্তির দোয়া", "মাসনূন আমল",
    "রমজান ক্যালেন্ডার ২০২৬", "সেহরি ও ইফতারের সময়সূচি", "যাকাত ক্যালকুলেটর", "ডিজিটাল তাসবীহ", "কিবলা কম্পাস",
    "Islamic app Bangladesh", "Bangla Waz", "Islamic Bayan", "Quran Bangla", "Prayer Times Dhaka", "Islamic Gojol",
  ],
  authors: [{ name: "Markazul Ihsan" }],
  creator: "islahbd",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী | মারকাযুল ইহসান`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "islahbd — Markazul Ihsan Islamic App" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — আপনার ইসলামিক ডিজিটাল সঙ্গী | মারকাযুল ইহসান`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon-192.png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
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
        <GlobalJsonLd />
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
