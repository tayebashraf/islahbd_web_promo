const BACKEND = (
  process.env.MMS_BACKEND_URL ??
  process.env.LIFETIME_MEMBER_API_URL ??
  "https://ihsan.markazulihsan.com"
).replace(/\/+$/, "");
const MAX_LEN = 300;

// Annual contribution (BDT) per tier — must match TIERS in lifetime-member-client.tsx.
export const TIER_AMOUNTS: Record<string, number> = {
  platinum: 100000,
  diamond: 75000,
  gold: 50000,
  silver: 25000,
  vip: 10000,
  well_wisher: 5000,
  supporter: 3000,
};

const STATUSES = new Set(["later", "payment_sent"]);

export interface ApplicationRecord {
  status: string;
  tierId: string;
  tierTitle: string;
  amount: string;
  name: string;
  phone: string;
  whatsapp: string;
  profession: string;
  address: string;
  mediumName: string;
  mediumPhone: string;
  paymentMethod: string;
  senderNumber: string;
  trxId: string;
}

export function clean(value: unknown, max = MAX_LEN): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function isBdPhone(value: string): boolean {
  return /^01[3-9]\d{8}$/.test(value);
}

export function parseApplication(body: Record<string, unknown>): ApplicationRecord {
  return {
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
}

export function isValidApplication(record: ApplicationRecord): boolean {
  return (
    STATUSES.has(record.status) &&
    record.tierId in TIER_AMOUNTS &&
    !!record.name &&
    !!record.profession &&
    !!record.address &&
    isBdPhone(record.phone)
  );
}

export type SubmitResult = { ok: true } | { ok: false; error: "backend_error" | "backend_unreachable" };

// Forwards an application to the Django backend, which stores it (admin panel / live admin app)
// and appends it to the Google Sheet.
export async function submitApplication(record: ApplicationRecord): Promise<SubmitResult> {
  try {
    const res = await fetch(`${BACKEND}/api/lifetime-member/apply/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("lifetime-member: backend rejected application", res.status, await res.text().catch(() => ""));
      return { ok: false, error: "backend_error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("lifetime-member: backend request error", err);
    return { ok: false, error: "backend_unreachable" };
  }
}
