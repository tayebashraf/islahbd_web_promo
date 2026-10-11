// bKash Tokenized Checkout (PGW v2, non-beta) — server-side only.
// Spec: "PGW Tokenized Payment V2 (Non-Beta) — API Specification V1.2".
// Credentials come from env; never import this file into a client component.

const BASE_URL = (process.env.BKASH_BASE_URL ?? "https://tokenized.sandbox.bka.sh/v2").replace(/\/+$/, "");
const APP_KEY = process.env.BKASH_APP_KEY ?? "";
const APP_SECRET = process.env.BKASH_APP_SECRET ?? "";
const USERNAME = process.env.BKASH_USERNAME ?? "";
const PASSWORD = process.env.BKASH_PASSWORD ?? "";

// bKash asks merchants to time out every call after 30 seconds.
const TIMEOUT_MS = 30_000;

export class BkashError extends Error {
  constructor(
    message: string,
    readonly code: string,
    // Message from bKash meant to be shown to the customer as-is (spec: "Response Codes" note).
    readonly customerMessage: string | null = null
  ) {
    super(message);
  }
}

export function isBkashConfigured(): boolean {
  return !!(APP_KEY && APP_SECRET && USERNAME && PASSWORD);
}

type BkashResponse = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
}

async function post(path: string, headers: Record<string, string>, body: unknown): Promise<BkashResponse> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = (await res.json().catch(() => null)) as BkashResponse | null;
  if (!data) throw new BkashError(`bKash ${path}: HTTP ${res.status} with no JSON body`, "no_response");

  // Errors arrive as { externalCode, errorMessageEn, errorMessageBn } (v2) or { statusCode, statusMessage }.
  const code = str(data.externalCode) || (data.statusCode && data.statusCode !== "0000" ? str(data.statusCode) : "");
  if (code || !res.ok) {
    const en = str(data.errorMessageEn) || str(data.statusMessage);
    const bn = str(data.errorMessageBn);
    throw new BkashError(`bKash ${path}: ${code || res.status} ${en}`, code || String(res.status), bn || en || null);
  }
  return data;
}

// ── Token management ─────────────────────────────────────────────
// One token per server instance, re-granted shortly before it expires (default lifetime 3600s).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;
  if (!isBkashConfigured()) throw new BkashError("bKash credentials are not configured", "not_configured");

  const data = await post(
    "/tokenized-checkout/auth/grant-token",
    { username: USERNAME, password: PASSWORD },
    { app_key: APP_KEY, app_secret: APP_SECRET }
  );
  const token = str(data.id_token);
  if (!token) throw new BkashError("bKash grant-token returned no id_token", "no_token");
  const lifetimeSec = Number(data.expires_in) || 3600;
  cachedToken = { value: token, expiresAt: Date.now() + (lifetimeSec - 300) * 1000 };
  return token;
}

async function authedPost(path: string, body: unknown): Promise<BkashResponse> {
  const token = await getToken();
  return post(path, { Authorization: token, "X-App-Key": APP_KEY }, body);
}

const BACKEND_URL = (
  process.env.MMS_BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.LIFETIME_MEMBER_API_URL ??
  "https://ihsan.markazulihsan.com"
).replace(/\/+$/, "");

export interface CreatedPayment {
  paymentId: string;
  bkashURL: string;
}

export async function createPayment(input: {
  amount: number;
  payerReference: string;
  merchantInvoiceNumber: string;
  callbackURL: string;
  application?: Record<string, unknown>;
}): Promise<CreatedPayment> {
  // 1. Try forwarding to Django backend first to record transaction and audit log on the server
  try {
    const res = await fetch(`${BACKEND_URL}/api/bkash/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: input.amount,
        payerReference: input.payerReference,
        merchantInvoiceNumber: input.merchantInvoiceNumber,
        callbackURL: input.callbackURL,
        application: input.application,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const data = (await res.json()) as { ok?: boolean; paymentId?: string; bkashURL?: string };
      if (data.paymentId && data.bkashURL) {
        return { paymentId: data.paymentId, bkashURL: data.bkashURL };
      }
    } else {
      const errData = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
      if (errData?.message) {
        console.warn("bKash backend returned error:", errData);
      }
    }
  } catch (backendErr) {
    console.warn("bKash create: Django backend request failed, trying direct bKash fallback:", backendErr);
  }

  // 2. Direct fallback to bKash API if backend is not reachable or direct config exists
  const data = await authedPost("/tokenized-checkout/payment/create", {
    payerReference: input.payerReference,
    callbackURL: input.callbackURL,
    amount: input.amount.toFixed(2),
    currency: "BDT",
    intent: "sale",
    merchantInvoiceNumber: input.merchantInvoiceNumber,
  });
  const paymentId = str(data.paymentId) || str(data.paymentID);
  const bkashURL = str(data.bkashURL) || str(data.bKashURL);
  if (!paymentId || !bkashURL) throw new BkashError("bKash create returned no paymentId/bkashURL", "bad_response");
  return { paymentId, bkashURL };
}

export interface PaymentResult {
  completed: boolean;
  transactionStatus: string;
  trxId: string;
  amount: string;
  payerAccount: string;
  merchantInvoiceNumber: string;
}

function toResult(data: BkashResponse): PaymentResult {
  const transactionStatus = str(data.transactionStatus);
  return {
    completed: transactionStatus === "Completed",
    transactionStatus,
    trxId: str(data.trxId),
    amount: str(data.amount),
    payerAccount: str(data.payerAccount),
    merchantInvoiceNumber: str(data.merchantInvoiceNumber) || str(data.merchantInvoice),
  };
}

export async function queryPayment(paymentId: string): Promise<PaymentResult> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/bkash/query/${paymentId}/`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const data = (await res.json()) as { transaction?: Record<string, unknown> };
      if (data.transaction) {
        return toResult(data.transaction);
      }
    }
  } catch (err) {
    console.warn("bKash query: Django backend request failed, trying direct fallback:", err);
  }
  return toResult(await authedPost("/tokenized-checkout/query/payment", { paymentId }));
}

// Executes a payment after bKash's success callback. If execute gives no usable answer
// (timeout / network / "already executed"), the spec says to fall back to Query Payment.
export async function executePayment(paymentId: string): Promise<PaymentResult> {
  // 1. Try executing via Django backend to persist status, link application, and write server logs
  try {
    const res = await fetch(`${BACKEND_URL}/api/bkash/execute/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      return {
        completed: data.completed === true || data.transactionStatus === "Completed",
        transactionStatus: str(data.transactionStatus) || "Completed",
        trxId: str(data.trxId),
        amount: str(data.amount),
        payerAccount: str(data.payerAccount),
        merchantInvoiceNumber: str(data.merchantInvoiceNumber),
      };
    }
  } catch (backendErr) {
    console.warn("bKash execute: Django backend request failed, trying direct bKash fallback:", backendErr);
  }

  // 2. Direct bKash fallback
  return toResult(await authedPost("/tokenized-checkout/payment/execute", { paymentId }));
}

