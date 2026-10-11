// Validates new lifetime-member applications and forwards them to the Django backend, which
// stores them (admin panel / live admin app) and appends them to the Google Sheet.

import { isValidApplication, parseApplication, submitApplication } from "@/lib/lifetime-member";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const record = parseApplication(body);
  if (!isValidApplication(record)) {
    return Response.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const result = await submitApplication(record);
  if (!result.ok) return Response.json(result, { status: 502 });
  return Response.json({ ok: true });
}
