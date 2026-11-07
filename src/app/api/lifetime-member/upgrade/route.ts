// An existing lifetime member asks for a bigger package: member number + registered mobile + the tier.
// The MMS stores a pending request and takes the amount from its own tier list; nothing changes until
// the office approves. The MMS sees every visitor as this server, so each visitor is limited here.

import { NextResponse } from "next/server";

const BACKEND = (
  process.env.MMS_BACKEND_URL ??
  process.env.LIFETIME_MEMBER_API_URL ??
  "https://ihsan.markazulihsan.com"
).replace(/\/+$/, "");

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toEn = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
const TIER_IDS = ["platinum", "diamond", "gold", "silver", "vip", "well_wisher", "supporter"];

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 8;
const hits = new Map<string, number[]>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowed(ip)) {
    return NextResponse.json({ ok: false, message: "অনেকবার চেষ্টা হয়েছে। এক ঘণ্টা পরে আবার চেষ্টা করুন।" }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const memberId = toEn(String(body?.memberId ?? "")).replace(/[^0-9]/g, "").slice(0, 7);
  let phone = toEn(String(body?.phone ?? "")).replace(/[^0-9]/g, "");
  if (phone.startsWith("880")) phone = "0" + phone.slice(3);
  const tierId = String(body?.tierId ?? "");
  if (!memberId || !/^01[3-9]\d{8}$/.test(phone) || !TIER_IDS.includes(tierId)) {
    return NextResponse.json({ ok: false, message: "সদস্য নং, মোবাইল নম্বর ও নতুন প্যাকেজ — তিনটিই দিন।" }, { status: 400 });
  }
  try {
    const res = await fetch(`${BACKEND}/api/v1/payments/lifetime-member/upgrade/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ member_id: memberId, phone, tier_id: tierId }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => null);
    if (data && typeof data.ok === "boolean") {
      return NextResponse.json({ ok: data.ok, already: data.already === true, message: String(data.message ?? "") }, { status: res.status });
    }
    console.error("lifetime upgrade: backend answered", res.status);
  } catch (err) {
    console.error("lifetime upgrade: backend unreachable", err);
  }
  return NextResponse.json({ ok: false, message: "এই মুহূর্তে অনুরোধ পাঠানো যাচ্ছে না। একটু পরে চেষ্টা করুন।" }, { status: 503 });
}
