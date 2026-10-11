// SSLCOMMERZ Hosted Checkout V4 — server-side helper for web promo.
// Forward to MMS backend engine (https://ihsan.markazulihsan.com).

const BACKEND_URL = (
  process.env.MMS_BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.LIFETIME_MEMBER_API_URL ??
  "https://ihsan.markazulihsan.com"
).replace(/\/+$/, "");

const TIMEOUT_MS = 30_000;

export class SslcommerzError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly customerMessage: string | null = null
  ) {
    super(message);
  }
}

export interface CreatedSslcommerzPayment {
  tranId: string;
  gatewayPageURL: string;
}

export async function createSslcommerzPayment(input: {
  amount: number;
  payerReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  merchantInvoiceNumber?: string;
  callbackURL?: string;
  application?: Record<string, unknown>;
}): Promise<CreatedSslcommerzPayment> {
  const res = await fetch(`${BACKEND_URL}/api/sslcommerz/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: input.amount,
      payerReference: input.payerReference,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      customerAddress: input.customerAddress,
      merchantInvoiceNumber: input.merchantInvoiceNumber,
      callbackURL: input.callbackURL,
      application: input.application,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const data = (await res.json().catch(() => null)) as {
    ok?: boolean;
    GatewayPageURL?: string;
    tran_id?: string;
    paymentId?: string;
    message?: string;
    error?: string;
  } | null;

  if (res.ok && data?.GatewayPageURL && (data.tran_id || data.paymentId)) {
    return {
      tranId: (data.tran_id || data.paymentId)!,
      gatewayPageURL: data.GatewayPageURL,
    };
  }

  const errMsg = data?.message || data?.error || "SSLCOMMERZ পেমেন্ট সেশন তৈরি করা যায়নি।";
  throw new SslcommerzError(errMsg, data?.error || "sslcz_error", data?.message || null);
}
