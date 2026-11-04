import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/server/db";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export const Route = createFileRoute("/api/auth/reset-password")({ server: { handlers: { POST: async ({ request }) => {
  try { const body = await request.json(); const resetToken = String(body.resetToken ?? ""); const password = String(body.password ?? "");
    if (resetToken.length < 32 || password.length < 8) return Response.json({ success: false, message: "Invalid reset request or password too short." }, { status: 400 });
    const db = await getDb(); const resets = db.collection("passwordResets"); const record = await resets.findOne({ resetTokenHash: hash(resetToken), verified: true, resetExpiresAt: { $gt: new Date() } });
    if (!record) return Response.json({ success: false, message: "Password reset session expired. Please start again." }, { status: 400 });
    const passwordHash = await bcrypt.hash(password, 12); const result = await db.collection("users").updateOne({ email: record.email }, { $set: { passwordHash, passwordUpdatedAt: new Date() } });
    await resets.deleteMany({ email: record.email }); if (!result.matchedCount) return Response.json({ success: false, message: "Account could not be found." }, { status: 404 });
    return Response.json({ success: true, message: "Password updated successfully." });
  } catch (error) { console.error("Password reset error:", error); return Response.json({ success: false, message: "Unable to update password." }, { status: 500 }); }
} } } });
