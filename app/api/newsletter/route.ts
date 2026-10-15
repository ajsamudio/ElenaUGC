import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  // Honeypot, same trick as the inquiry form.
  nickname: z.string().optional(),
});

export async function POST(req: Request) {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 422 });
  }
  if (parsed.data.nickname) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL ?? "onboarding@resend.dev";
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || (!to && !audienceId)) {
    console.error("Missing RESEND_API_KEY, or neither INQUIRY_TO_EMAIL nor RESEND_AUDIENCE_ID is set.");
    return NextResponse.json(
      { error: "Sign-ups aren't open just yet. Please try again later." },
      { status: 500 }
    );
  }

  const { email } = parsed.data;
  const resend = new Resend(apiKey);

  try {
    // Save to the Resend audience when one is set up, so Elena can send broadcasts.
    if (audienceId) {
      const { error } = await resend.contacts.create({ audienceId, email, unsubscribed: false });
      if (error) {
        console.error("Resend contact error:", error);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
      }
    }

    // Always drop Elena a note so no sign-up gets lost.
    if (to) {
      const { error } = await resend.emails.send({
        from: `Elena UGC Newsletter <${from}>`,
        to: to.split(",").map((s) => s.trim()),
        subject: `★ New newsletter sign-up: ${email}`,
        text: `${email} just joined your newsletter from the website.`,
      });
      if (error) console.error("Resend notify error:", error);
    }
  } catch (err) {
    console.error("Resend threw:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
