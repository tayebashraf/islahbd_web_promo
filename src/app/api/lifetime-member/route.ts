// Validates new lifetime-member applications and forwards them to the Django backend, which
// stores them (admin panel / live admin app) and appends them to the Google Sheet.

const BACKEND = process.env.LIFETIME_MEMBER_API_URL ?? "https://api.islahbd.com";
const MAX_LEN = 300;

const TIER_IDS = new Set(["platinum", "diamond", "gold", "silver", "vip", "well_wisher", "supporter"]);
const STATUSES = new Set(["later", "payment_sent"]);

function clean(value: unknown, max = MAX_LEN): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isBdPhone(value: string): boolean {
  return /^01[3-9]\d{8}$/.test(value);
}

export async function POST(request: Request) {
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
    const res = await fetch(`${BACKEND}/api/lifetime-member/apply/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("lifetime-member: backend rejected application", res.status, await res.text().catch(() => ""));
      return Response.json({ ok: false, error: "backend_error" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("lifetime-member: backend request error", err);
    return Response.json({ ok: false, error: "backend_unreachable" }, { status: 502 });
  }
}
