// Shared shape of a lifetime member found by punching their member card (kiosk mode).
// Built on the server by /api/lifetime-member/punch, read by the punch kiosk on the page.

export type PunchYearStatus = "paid" | "partial" | "due" | "advance" | "none";

export interface PunchYear {
  year: number;
  /** paid / advance = settled · partial / due = can be paid · none = no record (not counted as due) */
  status: PunchYearStatus;
  paid: number;
  expected: number;
  receipts: string[];
}

export interface PunchMember {
  memberId: string;
  name: string;
  /** yearly pledge in taka; 0 when unknown */
  pledge: number;
  address: string;
  /** full number, only used as the payer reference when paying */
  phone: string;
  phoneMasked: string;
  joinYear: number | null;
  years: PunchYear[];
  /** live = MMS database (online payments included) · sheet = the office's published sheet */
  source: "live" | "sheet";
}

export type PunchLookupResult =
  | { ok: true; members: PunchMember[] }
  | { ok: false; reason: "invalid" | "not_found" | "unavailable" | "rate_limited" };

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Card readers type the number with leading zeros ("0006752433"); the sheet stores "6752433". */
export function normalizePunchCode(raw: string): string {
  return raw
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/\D/g, "")
    .replace(/^0+/, "");
}

export function isDueStatus(status: PunchYearStatus): boolean {
  return status === "due" || status === "partial";
}

export function isSettledStatus(status: PunchYearStatus): boolean {
  return status === "paid" || status === "advance";
}

/** Every counted year is settled, including the running year — the member gets the welcome. */
export function isFullyPaid(member: PunchMember, currentYear: number): boolean {
  const counted = member.years.filter((y) => y.status !== "none");
  if (counted.length === 0 || counted.some((y) => isDueStatus(y.status))) return false;
  const running = member.years.find((y) => y.year === currentYear);
  return !!running && isSettledStatus(running.status);
}
