// Receives new lifetime-member applications and appends them to the Google Sheet
// through the Apps Script web app (see scripts/google-apps-script/lifetime-member-apply.gs).

const MAX_LEN = 300;

const TIER_IDS = new Set(["platinum", "diamond", "gold", "silver", "vip", "well_wisher"]);
const STATUSES = new Set(["later", "payment_sent"]);

function clean(value: unknown, max = MAX_LEN): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isBdPhone(value: string): boolean {
  return /^01[3-9]\d{8}$/.test(value);
}

export async function POST(request: Request) {
  const webhookUrl = process.env.LIFETIME_MEMBER_SHEET_WEBHOOK_URL;
  const secret = process.env.LIFETIME_MEMBER_SHEET_SECRET;
  if (!webhookUrl || !secret) {
    console.error("lifetime-member: LIFETIME_MEMBER_SHEET_WEBHOOK_URL / LIFETIME_MEMBER_SHEET_SECRET not set");
    return Response.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const record = {
    status: clean(body.status, 20),
    tierId: clean(body.tierId, 20),
    tierTitle: clean(body.tierTitle),
    amount: clean(body.amount, 40),
    name: clean(body.name),
    phone: clean(body.phone, 15),
    whatsapp: clean(body.whatsapp, 15),
    profession: clean(body.profession),
    address: clean(body.address),
    mediumName: clean(body.mediumName),
    mediumPhone: clean(body.mediumPhone, 15),
    paymentMethod: clean(body.paymentMethod, 40),
    senderNumber: clean(body.senderNumber, 15),
    trxId: clean(body.trxId, 80),
  };

  if (
    !STATUSES.has(record.status) ||
    !TIER_IDS.has(record.tierId) ||
    !record.name ||
    !record.profession ||
    !record.address ||
    !isBdPhone(record.phone)
  ) {
    return Response.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      // text/plain avoids a CORS preflight, which Apps Script cannot answer.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, ...record }),
      redirect: "follow",
      cache: "no-store",
    });
    const result = await res.json().catch(() => null);
    if (!res.ok || !result?.ok) {
      console.error("lifetime-member: sheet write failed", res.status, result);
      return Response.json({ ok: false, error: "sheet_write_failed" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("lifetime-member: sheet request error", err);
    return Response.json({ ok: false, error: "sheet_unreachable" }, { status: 502 });
  }
}
