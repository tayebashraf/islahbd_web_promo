// Existing lifetime member's yearly record, read live from the MMS database (member number + mobile).
// Online payments show up here at once — the published Google Sheet only changes when the office edits it.

import { NextResponse } from "next/server";

const BACKEND = (
  process.env.MMS_BACKEND_URL ??
  process.env.LIFETIME_MEMBER_API_URL ??
  "https://ihsan.markazulihsan.com"
).replace(/\/+$/, "");

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toEn = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const memberNo = toEn(String(body?.memberId ?? "")).replace(/[^0-9]/g, "").slice(0, 7);
  let phone = toEn(String(body?.mobile ?? "")).replace(/[^0-9]/g, "");
  if (phone.startsWith("880")) phone = "0" + phone.slice(3);
  if (!memberNo || !/^01[3-9]\d{8}$/.test(phone)) {
    return NextResponse.json({ ok: false, message: "সদস্য নং ও সঠিক মোবাইল নম্বর লিখুন।" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/payments/member-lookup/lifetime/?member_no=${memberNo}&phone=${phone}`,
      { cache: "no-store", signal: AbortSignal.timeout(15000) }
    );
    const data = await res.json().catch(() => null);
    if (res.status === 404 && data?.ok === false) return NextResponse.json({ ok: false }, { status: 404 });
    if (res.ok && data?.ok && data.member) return NextResponse.json({ ok: true, member: data.member });
    console.error("lifetime lookup: backend answered", res.status);
  } catch (err) {
    console.error("lifetime lookup: backend unreachable", err);
  }
  return NextResponse.json({ ok: false, unavailable: true }, { status: 503 });
}
