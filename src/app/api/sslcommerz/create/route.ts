import { NextResponse } from "next/server";
import { SslcommerzError, createSslcommerzPayment } from "@/lib/sslcommerz";
import { TIER_AMOUNTS, isBdPhone, isValidApplication, parseApplication } from "@/lib/lifetime-member";

const MAX_EXISTING_AMOUNT = 1_000_000;

function fail(error: string, status: number, message?: string | null) {
  return NextResponse.json({ ok: false, error, message: message ?? null }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("invalid_json", 400);
  }

  const stamp = Date.now().toString(36).toUpperCase();
  let amount: number;
  let payerReference: string;
  let customerName: string = "Donor Member";
  let customerPhone: string = "";
  let customerAddress: string = "Dhaka, Bangladesh";
  let merchantInvoiceNumber: string;
  let applicationData: Record<string, unknown> | undefined;

  if (body.kind === "new") {
    const record = parseApplication({
      ...(typeof body.application === "object" && body.application ? body.application : {}),
      status: "payment_sent",
    });
    if (!isValidApplication(record)) return fail("invalid_data", 400);

    amount = TIER_AMOUNTS[record.tierId];
    payerReference = record.phone;
    customerName = record.name;
    customerPhone = record.phone;
    customerAddress = record.address || "Dhaka, Bangladesh";
    merchantInvoiceNumber = `LMN-SSLCZ-${record.tierId.slice(0, 4).toUpperCase()}-${stamp}`;
    applicationData = record as unknown as Record<string, unknown>;
  } else if (body.kind === "existing") {
    const memberId = String(body.memberId ?? "").replace(/[^0-9]/g, "").slice(0, 10);
    const phone = String(body.phone ?? "").replace(/[^0-9]/g, "");
    const name = String(body.name ?? "Lifetime Member").trim();
    const years = Array.isArray(body.years)
      ? body.years.filter((y): y is number => Number.isInteger(y) && y >= 2000 && y <= 2100).slice(0, 15)
      : [];
    amount = Number(body.amount);

    if (!memberId || !Number.isInteger(amount) || amount < 10 || amount > MAX_EXISTING_AMOUNT) {
      return fail("invalid_data", 400, "অনুদান সর্বনিম্ন ১০ টাকা হতে হবে।");
    }

    payerReference = isBdPhone(phone) ? phone : `M${memberId}`;
    customerName = name || `Member #${memberId}`;
    customerPhone = isBdPhone(phone) ? phone : "01711000000";
    merchantInvoiceNumber = `LMX-SSLCZ-${memberId}-${years.length ? years.join(".") : "NA"}-${stamp}`.slice(0, 60);
  } else {
    return fail("invalid_data", 400);
  }

  const origin = new URL(request.url).origin;
  const callbackURL = `${origin}/lifetime-member`;

  try {
    const payment = await createSslcommerzPayment({
      amount,
      payerReference,
      customerName,
      customerPhone,
      customerAddress,
      merchantInvoiceNumber,
      callbackURL,
      application: applicationData,
    });

    return NextResponse.json({
      ok: true,
      gatewayPageURL: payment.gatewayPageURL,
      tranId: payment.tranId,
      amount,
    });
  } catch (err) {
    console.error("sslcommerz: create payment failed", err);
    if (err instanceof SslcommerzError && err.customerMessage) {
      return fail("sslcz_error", 502, err.customerMessage);
    }
    return fail("sslcz_unreachable", 502, "SSLCOMMERZ গেটওয়ে সংযোগে ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।");
  }
}
