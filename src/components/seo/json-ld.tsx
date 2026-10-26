import { SITE_NAME, SITE_URL, PLAY_STORE_URL, APP_STORE_URL } from "@/lib/constants";

export function GlobalJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "মারকাযুল ইহসান — Markazul Ihsan",
    alternateName: ["islahbd", "IslahBD", "মারকাজুল ইহসান ডেমরা"],
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    sameAs: [
      "https://www.facebook.com/islahiboyanBD",
      "https://www.youtube.com/@islahbd",
      "https://t.me/eslahiboyanbd",
      PLAY_STORE_URL,
      APP_STORE_URL,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Demra",
      addressRegion: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["Bengali", "English", "Arabic"],
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "islahbd",
    alternateName: "আপনার ইসলামিক ডিজিটাল সঙ্গী",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/quran/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const mobileAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IslahBD — ইসলামিক ডিজিটাল সঙ্গী",
    operatingSystem: "Android, iOS",
    applicationCategory: "LifestyleApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1250",
    },
    downloadUrl: [PLAY_STORE_URL, APP_STORE_URL],
    description:
      "মারকাযুল ইহসানের অফিসিয়াল ইসলামিক অ্যাপ। পাঁচ ওয়াক্ত নামাজের সঠিক সময়সূচী, আল-কুরআনুল কারীম, হযরত মাওলানা তৈয়্যেব আশরাফ সাহেবের বয়ান, ইসলামিক গজল, প্রতিদিনের দোয়া ও আমল।",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileAppSchema) }}
      />
    </>
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
