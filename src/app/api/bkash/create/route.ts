// Starts a bKash tokenized checkout for a lifetime-member contribution and returns the
// bKash page URL the browser should open. The result comes back to /api/bkash/callback.

import { NextResponse } from "next/server";
import { BkashError, createPayment, isBkashConfigured } from "@/lib/bkash";
import { TIER_AMOUNTS, isBdPhone, isValidApplication, parseApplication } from "@/lib/lifetime-member";
import { SESSION_COOKIE, SESSION_MAX_AGE, encodeSession, type PaymentSession } from "../session";

// Stay well under the browser's 4 KB per-cookie limit.
const MAX_COOKIE_LENGTH = 3800;
const MAX_EXISTING_AMOUNT = 1_000_000;

function fail(error: string, status: number, message?: string | null) {
  return NextResponse.json({ ok: false, error, message: message ?? null }, { status });
}

export async function POST(request: Request) {
  if (!isBkashConfigured()) return fail("not_configured", 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("invalid_json", 400);
  }

  const stamp = Date.now().toString(36).toUpperCase();
  let amount: number;
  let payerReference: string;
  let merchantInvoiceNumber: string;
  let application: PaymentSession["application"];

  if (body.kind === "new") {
    const record = parseApplication({
      ...(typeof body.application === "object" && body.application ? body.application : {}),
      status: "payment_sent",
    });
    if (!isValidApplication(record)) return fail("invalid_data", 400);
    // The amount is the tier's fixed contribution; the client never sets it.
    amount = TIER_AMOUNTS[record.tierId];
    payerReference = record.phone;
    merchantInvoiceNumber = `LMN-${record.tierId.slice(0, 4).toUpperCase()}-${stamp}`;
    application = record;
  } else if (body.kind === "existing") {
    const memberId = String(body.memberId ?? "").replace(/[^0-9]/g, "").slice(0, 10);
    const phone = String(body.phone ?? "").replace(/[^0-9]/g, "");
    const years = Array.isArray(body.years)
      ? body.years.filter((y): y is number => Number.isInteger(y) && y >= 2000 && y <= 2100).slice(0, 15)
      : [];
    amount = Number(body.amount);
    if (!memberId || !Number.isInteger(amount) || amount < 1 || amount > MAX_EXISTING_AMOUNT) {
      return fail("invalid_data", 400);
    }
    payerReference = isBdPhone(phone) ? phone : `M${memberId}`;
    // Lets the accounts office match the bKash transaction to the member and years paid.
    merchantInvoiceNumber = `LMX-${memberId}-${years.length ? years.join(".") : "NA"}-${stamp}`.slice(0, 60);
  } else {
    return fail("invalid_data", 400);
  }

  const origin = new URL(request.url).origin;
  let payment;
  try {
    payment = await createPayment({
      amount,
      payerReference,
      merchantInvoiceNumber,
      callbackURL: `${origin}/api/bkash/callback`,
      application: application as unknown as Record<string, unknown>,
    });
  } catch (err) {
    console.error("bkash: create payment failed", err);
    if (err instanceof BkashError && err.customerMessage) return fail("bkash_error", 502, err.customerMessage);
    return fail("bkash_unreachable", 502);
  }

  const cookie = encodeSession({ paymentId: payment.paymentId, app: body.app === true, application });
  if (cookie.length > MAX_COOKIE_LENGTH) return fail("too_long", 400);

  const res = NextResponse.json({ ok: true, bkashURL: payment.bkashURL, amount });
  res.cookies.set(SESSION_COOKIE, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "lax" still sends the cookie on bKash's top-level redirect back to the callback.
    sameSite: "lax",
    path: "/api/bkash",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
