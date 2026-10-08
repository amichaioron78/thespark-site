import { NextResponse } from "next/server";

/**
 * Contact-form endpoint. Replaces Webflow's built-in form handling.
 *
 * Delivery: set RESEND_API_KEY (https://resend.com) and optionally
 * CONTACT_TO (default info@thespark.ai) / CONTACT_FROM in the Vercel project
 * env. Without a key the submission is logged to the server log only and the
 * user still sees the success message, so the form never "breaks" publicly.
 */
export const runtime = "nodejs";

const TO = process.env.CONTACT_TO || "info@thespark.ai";
const FROM = process.env.CONTACT_FROM || "SPARK Website <onboarding@resend.dev>";

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const email = (body.email || "").trim();
  const name = (body["Full-Name"] || body.name || "").trim();
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide your name and a valid email" }, { status: 400 });
  }

  const lines = Object.entries(body)
    .filter(([k]) => k !== "website")
    .map(([k, v]) => `${k.replace(/-/g, " ")}: ${String(v).trim()}`);
  const text = lines.join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.log("[contact] (no RESEND_API_KEY configured)\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `New website inquiry from ${name}${body.source ? ` (${body.source})` : ""}`,
      text,
    }),
  });
  if (!res.ok) {
    console.error("[contact] resend error", res.status, await res.text());
    return NextResponse.json({ error: "Could not send your message" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
