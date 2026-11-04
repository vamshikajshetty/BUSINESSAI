import { createFileRoute } from "@tanstack/react-router";
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "@/lib/server/db";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const Route = createFileRoute("/api/auth/verify-reset-code")({ server: { handlers: { POST: async ({ request }) => {
  try { const body = await request.json(); const email = String(body.email ?? "").trim().toLowerCase(); const otp = String(body.otp ?? "");
    if (!/^\d{6}$/.test(otp)) return Response.json({ success: false, message: "Enter the 6-digit code." }, { status: 400 });
    const db = await getDb(); const resets = db.collection("passwordResets"); const record = await resets.findOne({ email, expiresAt: { $gt: new Date() }, verified: false });
    if (!record || (record.attempts ?? 0) >= 5) return Response.json({ success: false, message: "Code expired or invalid. Request a new one." }, { status: 400 });
    if (record.otpHash !== hash(otp)) { await resets.updateOne({ _id: record._id }, { $inc: { attempts: 1 } }); return Response.json({ success: false, message: "Incorrect code. Please try again." }, { status: 400 }); }
    const resetToken = randomBytes(32).toString("hex"); await resets.updateOne({ _id: record._id }, { $set: { verified: true, resetTokenHash: hash(resetToken), resetExpiresAt: new Date(Date.now() + 15 * 60 * 1000), verifiedAt: new Date() }, $unset: { otpHash: "" } });
    return Response.json({ success: true, resetToken });
  } catch (error) { console.error("OTP verification error:", error); return Response.json({ success: false, message: "Unable to verify the code." }, { status: 500 }); }
} } } });
