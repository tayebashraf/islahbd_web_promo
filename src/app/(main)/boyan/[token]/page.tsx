import type { Metadata } from "next";
import { DeepLinkRedirect } from "@/components/deep-link-redirect";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  return {
    title: "Opening in islahBD app…",
    description: "Redirecting to the islahBD app.",
    robots: { index: false },
    openGraph: {
      url: `${SITE_URL}/boyan/${token}`,
    },
  };
}

export default async function BoyanDeepLinkPage({ params }: Props) {
  const { token } = await params;
  const deepLink = `https://www.islahbd.com/boyan/${token}`;
  return (
    <DeepLinkRedirect deepLink={deepLink} section="boyan" token={token} />
  );
}
