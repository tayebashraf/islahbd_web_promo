// Short-lived cookie that carries a pending lifetime-member bKash payment from
// /api/bkash/create to /api/bkash/callback (the customer is on bKash's page in between).

import type { ApplicationRecord } from "@/lib/lifetime-member";

export const SESSION_COOKIE = "lm_bkash";
// bKash's own payment session lasts far less than this; it only bounds a stale cookie.
export const SESSION_MAX_AGE = 60 * 60;

export interface PaymentSession {
  paymentId: string;
  // True when the page was opened inside the IslahBD app webview.
  app: boolean;
  // Present for a new-member payment: stored with the bKash TrxID once the payment completes.
  application?: ApplicationRecord;
}

export function encodeSession(session: PaymentSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value: string | undefined): PaymentSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    return typeof parsed?.paymentId === "string" ? (parsed as PaymentSession) : null;
  } catch {
    return null;
  }
}
