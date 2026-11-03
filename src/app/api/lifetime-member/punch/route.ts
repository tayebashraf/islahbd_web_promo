// Kiosk lookup: a lifetime member punches their member card and their yearly record shows at once.
//
// The card number ("পাঞ্চ কোড") lives in the office's published member sheet next to the member
// number and mobile. The sheet maps card → member; the yearly record is then read live from the
// MMS database (online payments included). If the database cannot be reached, or does not know
// the sheet's mobile number, the sheet's own yearly columns are used instead.

import { NextResponse } from "next/server";
import { normalizePunchCode, type PunchMember, type PunchYear, type PunchYearStatus } from "@/lib/lifetime-punch";

const BACKEND = (
  process.env.MMS_BACKEND_URL ??
  process.env.LIFETIME_MEMBER_API_URL ??
  "https://ihsan.markazulihsan.com"
).replace(/\/+$/, "");

const MEMBER_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU_Ho2JCxvqg9PEeyxVXrdrHPsMpkXd_IJxHhu-mMQH07LYqcCh4jTYWM-5n9XFB9Hk5ngvRYd-xw7/pub?gid=0&single=true&output=csv";

// Sheet layout: punch code, member no, name, pledge, address, mobile, then one column per year.
const COL = { punch: 0, memberNo: 1, name: 2, pledge: 3, address: 4, mobile: 5, firstYear: 6 } as const;
const FIRST_SHEET_YEAR = 2018;
// The office counts unpaid sheet years as due only from this year on (same rule as the member portal).
const SHEET_DUE_FROM = 2024;

const SHEET_TTL_MS = 60_000;
const LIVE_TIMEOUT_MS = 10_000;
const MAX_MATCHES = 4;

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toEn = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

interface SheetRow {
  memberNo: string;
  name: string;
  pledge: number;
  address: string;
  phone: string;
  /** raw yearly cells, keyed by year */
  cells: Record<number, string>;
}

// ── Rate limit: a card reader sends one request per punch; this only stops number guessing. ──
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, list] of hits) if (list.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
  return recent.length > RATE_MAX;
}

// ── Sheet: fetched at most once a minute, shared by all requests on this server ──
let sheetCache: { at: number; index: Map<string, SheetRow[]> } | null = null;
let sheetLoading: Promise<Map<string, SheetRow[]>> | null = null;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') cell += c;
      else if (text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function normalizePhone(raw: string): string {
  let phone = toEn(raw).replace(/\D/g, "");
  if (phone.startsWith("880")) phone = "0" + phone.slice(3);
  else if (phone.length === 10 && phone.startsWith("1")) phone = "0" + phone;
  return phone;
}

function amountFrom(text: string): number {
  const value = parseInt(toEn(text).replace(/\/-.*$/, "").replace(/\D/g, ""), 10);
  return value > 0 ? value : 0;
}

async function loadSheet(): Promise<Map<string, SheetRow[]>> {
  const res = await fetch(MEMBER_CSV_URL, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`sheet answered ${res.status}`);
  const index = new Map<string, SheetRow[]>();
  for (const cols of parseCsv(await res.text())) {
    const code = normalizePunchCode((cols[COL.punch] ?? "").trim());
    const memberNo = toEn(cols[COL.memberNo] ?? "").replace(/\D/g, "");
    if (!code || !memberNo || Number(memberNo) <= 0) continue;
    const cells: Record<number, string> = {};
    for (let i = COL.firstYear; i < cols.length; i++) cells[FIRST_SHEET_YEAR + i - COL.firstYear] = (cols[i] ?? "").trim();
    const row: SheetRow = {
      memberNo,
      name: (cols[COL.name] ?? "").trim(),
      pledge: amountFrom(cols[COL.pledge] ?? ""),
      address: (cols[COL.address] ?? "").trim(),
      phone: normalizePhone(cols[COL.mobile] ?? ""),
      cells,
    };
    index.set(code, [...(index.get(code) ?? []), row]);
  }
  return index;
}

async function sheetIndex(): Promise<Map<string, SheetRow[]>> {
  if (sheetCache && Date.now() - sheetCache.at < SHEET_TTL_MS) return sheetCache.index;
  sheetLoading ??= loadSheet()
    .then((index) => {
      sheetCache = { at: Date.now(), index };
      return index;
    })
    .finally(() => {
      sheetLoading = null;
    });
  try {
    return await sheetLoading;
  } catch (err) {
    // a stale copy is better than nothing while Google is slow
    if (sheetCache) return sheetCache.index;
    throw err;
  }
}

// ── Year rows ──
function sheetCellPaid(cell: string): boolean {
  const lower = cell.toLowerCase();
  return (
    cell.length > 0 &&
    cell !== "0" &&
    !lower.includes("reject") &&
    !lower.includes("clos") &&
    !lower.includes("cancel") &&
    !lower.includes("unactive")
  );
}

function yearsFromSheet(row: SheetRow, currentYear: number): PunchYear[] {
  const paidYears = Object.keys(row.cells)
    .map(Number)
    .filter((y) => sheetCellPaid(row.cells[y]))
    .sort((a, b) => a - b);
  const first = paidYears[0] ?? currentYear;
  const last = Math.max(currentYear, paidYears[paidYears.length - 1] ?? currentYear);
  const years: PunchYear[] = [];
  for (let year = first; year <= last; year++) {
    const cell = row.cells[year] ?? "";
    const paid = sheetCellPaid(cell);
    if (!paid && year > currentYear) continue;
    const status: PunchYearStatus = paid
      ? year > currentYear
        ? "advance"
        : "paid"
      : year >= SHEET_DUE_FROM
        ? "due"
        : "none";
    years.push({ year, status, paid: paid ? amountFrom(cell) || row.pledge : 0, expected: row.pledge, receipts: [] });
  }
  return years;
}

interface LiveYear {
  period?: unknown;
  paid?: unknown;
  expected?: unknown;
  status?: unknown;
  receipts?: { receipt_no?: string; transaction_id?: string }[];
}

function yearsFromLive(m: Record<string, unknown>, pledge: number, currentYear: number): PunchYear[] {
  const rows = Array.isArray(m.years) ? (m.years as LiveYear[]) : [];
  if (rows.length > 0) {
    const years: PunchYear[] = [];
    for (const r of rows) {
      const period = String(r.period ?? "");
      if (!/^\d{4}$/.test(period)) continue;
      const year = Number(period);
      const raw = String(r.status ?? "");
      // "na" = before joining, "upcoming" = a future year nobody has paid yet
      if (raw !== "paid" && raw !== "partial" && raw !== "due" && raw !== "advance") continue;
      if (year > currentYear && raw !== "advance") continue;
      years.push({
        year,
        status: raw,
        paid: Number(r.paid) || 0,
        expected: Number(r.expected) || pledge,
        receipts: (r.receipts ?? [])
          .map((x) => String(x.transaction_id || x.receipt_no || "").replace(/^TRX-/, ""))
          .filter(Boolean),
      });
    }
    return years.sort((a, b) => a.year - b.year);
  }

  // Older backend answer without per-year rows: rebuild from the paid / due year lists.
  const paid = new Set((Array.isArray(m.paid_years) ? m.paid_years : []).map(Number));
  const due = new Set((Array.isArray(m.due_years) ? m.due_years : []).map(Number));
  const known = [...paid, ...due].filter(Boolean);
  if (known.length === 0) return [];
  const first = Number(m.join_year) || Math.min(...known);
  const last = Math.max(currentYear, ...paid);
  const years: PunchYear[] = [];
  for (let year = first; year <= last; year++) {
    const isPaid = paid.has(year);
    if (!isPaid && year > currentYear) continue;
    const status: PunchYearStatus = isPaid ? (year > currentYear ? "advance" : "paid") : due.has(year) ? "due" : "none";
    years.push({ year, status, paid: isPaid ? pledge : 0, expected: pledge, receipts: [] });
  }
  return years;
}

function maskPhone(phone: string): string {
  return phone.length >= 8 ? `${phone.slice(0, 3)}${"•".repeat(phone.length - 6)}${phone.slice(-3)}` : "";
}

async function liveRecord(row: SheetRow): Promise<Record<string, unknown> | null> {
  if (!/^01[3-9]\d{8}$/.test(row.phone)) return null;
  try {
    const res = await fetch(
      `${BACKEND}/api/v1/payments/member-lookup/lifetime/?member_no=${row.memberNo}&phone=${row.phone}`,
      { cache: "no-store", signal: AbortSignal.timeout(LIVE_TIMEOUT_MS) }
    );
    if (!res.ok) {
      if (res.status !== 404) console.error("punch lookup: backend answered", res.status);
      return null;
    }
    const data = await res.json().catch(() => null);
    const m = data?.ok ? data.member : null;
    // unverified = the database has no mobile for this member, so it shares a masked name only
    return m && m.phone_verified !== false ? (m as Record<string, unknown>) : null;
  } catch (err) {
    console.error("punch lookup: backend unreachable", err);
    return null;
  }
}

async function buildMember(row: SheetRow, currentYear: number): Promise<PunchMember> {
  const live = await liveRecord(row);
  const base = {
    phone: row.phone,
    phoneMasked: maskPhone(row.phone),
  };
  if (live) {
    const pledge = Math.round(Number(live.pledge) || 0) || row.pledge;
    const years = yearsFromLive(live, pledge, currentYear);
    if (years.length > 0) {
      return {
        ...base,
        memberId: String(live.member_no || row.memberNo),
        name: String(live.name || row.name),
        pledge,
        address: String(live.address || row.address),
        joinYear: years[0].year,
        years,
        source: "live",
      };
    }
  }
  const years = yearsFromSheet(row, currentYear);
  return {
    ...base,
    memberId: row.memberNo,
    name: row.name,
    pledge: row.pledge,
    address: row.address,
    joinYear: years.find((y) => y.status !== "none")?.year ?? null,
    years,
    source: "sheet",
  };
}

function dhakaYear(): number {
  return Number(new Intl.DateTimeFormat("en", { timeZone: "Asia/Dhaka", year: "numeric" }).format(new Date()));
}

// Warm-up when the kiosk opens: loads the sheet so the first punch is answered fast,
// and tells the kiosk whether the member data can be reached.
export async function GET() {
  try {
    await sheetIndex();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const code = normalizePunchCode(String(body?.code ?? "")).slice(0, 16);
  if (code.length < 3) return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });

  let index: Map<string, SheetRow[]>;
  try {
    index = await sheetIndex();
  } catch (err) {
    console.error("punch lookup: member sheet unreachable", err);
    return NextResponse.json({ ok: false, reason: "unavailable" }, { status: 503 });
  }

  const rows = (index.get(code) ?? []).slice(0, MAX_MATCHES);
  if (rows.length === 0) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });

  const currentYear = dhakaYear();
  const members = await Promise.all(rows.map((row) => buildMember(row, currentYear)));
  return NextResponse.json({ ok: true, members }, { headers: { "Cache-Control": "no-store" } });
}
