import type { Metadata } from "next";
import { DeepLinkRedirect } from "@/components/deep-link-redirect";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  return {
    title: "Opening Short Clips in islahBD app…",
    description: "Redirecting to the islahBD app.",
    robots: { index: false },
    openGraph: {
      url: `${SITE_URL}/shortclips/${token}`,
    },
  };
}

export default async function ShortClipsDeepLinkPage({ params }: Props) {
  const { token } = await params;
  const deepLink = `https://www.islahbd.com/shortclips/${token}`;
  return (
    <DeepLinkRedirect deepLink={deepLink} section="shortclips" token={token} />
  );
}
