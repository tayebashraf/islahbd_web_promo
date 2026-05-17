import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

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
    { media: "(prefers-color-scheme: light)", color: "#F8F7F3" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1117" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LangProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
