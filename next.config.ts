import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "api.islahbd.com" },
      { protocol: "https", hostname: "cdn.islahbd.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async rewrites() {
    // Proxy HLS streams same-origin to eliminate browser CORS problems
    // (cdn2 currently answers with a duplicated Access-Control-Allow-Origin,
    // which browsers reject). Same-origin also lets the visualiser read audio.
    return [
      {
        source: "/hls/:path*",
        destination: "https://cdn.islahbd.com/live/:path*",
      },
      {
        source: "/hls2/:path*",
        destination: "https://cdn2.islahbd.com/live/:path*",
      },
      // Madrasa Markazul Ihsan's khidmat API (funds, member lookup/apply,
      // bKash/SSLCommerz checkout). It sends no CORS headers, so the browser
      // reaches it through us.
      {
        source: "/mk-api/khidmat/:path*",
        destination: "https://www.markazulihsan.com/api/khidmat/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
      // Android App Links verification file
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      // iOS Universal Links verification file (no extension — must be served as JSON)
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
