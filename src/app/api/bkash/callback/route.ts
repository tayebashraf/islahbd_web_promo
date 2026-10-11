// bKash redirects the customer here after the checkout page:
//   ?paymentID=...&status=success|failure|cancel&signature=...
// On success the payment is executed (that is what actually moves the money), a new-member
// application is stored with the bKash TrxID, and the customer is sent back to /lifetime-member.

import { NextResponse, type NextRequest } from "next/server";
import { BkashError, executePayment } from "@/lib/bkash";
import { submitApplication } from "@/lib/lifetime-member";
import { SESSION_COOKIE, decodeSession } from "../session";

const BKASH_ONLINE_METHOD = "বিকাশ (অনলাইন পেমেন্ট)";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const paymentId = params.get("paymentID") ?? params.get("paymentId") ?? "";
  const status = params.get("status") ?? "";
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  const result = new URLSearchParams();
  if (session?.app) result.set("app", "true");

  if (status !== "success") {
    result.set("bkash", status === "cancel" ? "cancel" : "failure");
  } else if (!paymentId || session?.paymentId !== paymentId) {
    // No matching session (expired cookie or a stray callback): never execute blind.
    console.error("bkash: callback without matching session", paymentId);
    result.set("bkash", "failure");
  } else {
    try {
      const payment = await executePayment(paymentId);
      if (payment.completed) {
        result.set("bkash", "success");
        result.set("trx", payment.trxId);
        result.set("amount", payment.amount);
        if (session.application) {
          const saved = await submitApplication({
            ...session.application,
            status: "payment_sent",
            paymentMethod: BKASH_ONLINE_METHOD,
            senderNumber: payment.payerAccount,
            trxId: payment.trxId,
          });
          // The money has moved either way; the page tells the customer to report the TrxID if this failed.
          if (!saved.ok) {
            console.error("bkash: paid but application not saved", payment.trxId, session.application);
            result.set("saved", "0");
          }
        }
      } else {
        console.error("bkash: payment not completed", paymentId, payment.transactionStatus);
        result.set("bkash", "failure");
      }
    } catch (err) {
      console.error("bkash: execute failed", paymentId, err);
      result.set("bkash", "failure");
      if (err instanceof BkashError && err.customerMessage) result.set("msg", err.customerMessage.slice(0, 200));
    }
  }

  const res = NextResponse.redirect(new URL(`/lifetime-member?${result}`, request.url), 303);
  res.cookies.delete({ name: SESSION_COOKIE, path: "/api/bkash" });
  return res;
}
