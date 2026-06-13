import type { Metadata } from "next";
import { DeepLinkRedirect } from "@/components/deep-link-redirect";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  return {
    title: "Opening Live in islahBD app…",
    description: "Redirecting to the islahBD app.",
    robots: { index: false },
    openGraph: {
      url: `${SITE_URL}/live/${token}`,
    },
  };
}

export default async function LiveDeepLinkPage({ params }: Props) {
  const { token } = await params;
  const deepLink = `https://islahbd.com/live/${token}`;
  return (
    <DeepLinkRedirect deepLink={deepLink} section="live" token={token} />
  );
}
