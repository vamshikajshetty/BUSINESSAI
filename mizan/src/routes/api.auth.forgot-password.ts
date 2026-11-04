import { createFileRoute } from "@tanstack/react-router";
import { createHash, randomInt } from "node:crypto";
import { getDb } from "@/lib/server/db";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const Route = createFileRoute("/api/auth/forgot-password")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const { email: rawEmail } = await request.json(); const email = String(rawEmail ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
    const db = await getDb(); const user = await db.collection("users").findOne({ email });
    // Use the same response for existing and unknown addresses to avoid account enumeration.
    if (!user) return Response.json({ success: true, message: "If this email is registered, a verification code has been sent." });
    const resets = db.collection("passwordResets"); const recent = await resets.countDocuments({ email, createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) } });
    if (recent >= 5) return Response.json({ success: false, message: "Too many requests. Please try again in an hour." }, { status: 429 });
    const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await resets.deleteMany({ email }); await resets.insertOne({ email, otpHash: hash(otp), createdAt: new Date(), expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0, verified: false });
    const apiKey = process.env.RESEND_API_KEY; const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) { await resets.deleteMany({ email }); console.error("Password reset email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL."); return Response.json({ success: false, message: "Email verification is not configured yet. Set up the email provider before using password recovery." }, { status: 503 }); }
    const mail = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [email], subject: "Your Mizan verification code", html: `<div style="font-family:Arial,sans-serif;color:#13294b"><h2>Password reset request</h2><p>Your Mizan verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 0">${otp}</div><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p></div>` }) });
    if (!mail.ok) { console.error("Password reset email delivery failed:", await mail.text()); await resets.deleteMany({ email }); return Response.json({ success: false, message: "Unable to deliver the verification email. Please try again later." }, { status: 502 }); }
    return Response.json({ success: true, message: "Verification code sent. Check your inbox." });
  } catch (error) { console.error("Forgot password error:", error); return Response.json({ success: false, message: "Unable to start password recovery." }, { status: 500 }); }
} } } });
