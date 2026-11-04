import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });
function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState(""); const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(""); const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(""); const [busy, setBusy] = useState(false);
  async function requestCode(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { const r = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim().toLowerCase() }) }); const d = await r.json(); if (!r.ok) throw new Error(d.message || "Unable to send verification code."); setStep("otp"); toast.success(d.message || "If the account exists, a verification code has been sent."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Unable to send code."); } finally { setBusy(false); }
  }
  async function verifyCode(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { const r = await fetch("/api/auth/verify-reset-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim().toLowerCase(), otp }) }); const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.message || "Invalid verification code."); setResetToken(d.resetToken); setStep("password"); toast.success("Email verified. Choose a new password."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Verification failed."); } finally { setBusy(false); }
  }
  async function updatePassword(e: React.FormEvent) {
    e.preventDefault(); if (password.length < 8) return toast.error("Use at least 8 characters."); if (password !== confirm) return toast.error("Passwords do not match."); setBusy(true);
    try { const r = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resetToken, password }) }); const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.message || "Password reset failed."); toast.success("Password updated. You can now sign in."); window.location.assign("/"); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Password reset failed."); } finally { setBusy(false); }
  }
  return <AuthShell title={step === "email" ? "Forgot password?" : step === "otp" ? "Verify your email" : "Create a new password"} sub={step === "email" ? "Enter your account email and we'll send a verification code." : step === "otp" ? `Enter the 6-digit code sent to ${email}.` : "Your email is verified. Set a new password for your account."}>
    {step === "email" && <form onSubmit={requestCode} className="space-y-5"><Field label="Registered email address"><div className="auth-input-wrap"><Mail size={17}/><Input type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}/></div></Field><Button className="auth-submit w-full" disabled={busy}>{busy ? "Sending code..." : "Send verification code"}</Button></form>}
    {step === "otp" && <form onSubmit={verifyCode} className="space-y-5"><Field label="6-digit verification code"><Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} required placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))} className="h-12 text-center text-xl tracking-[.5em]"/></Field><Button className="auth-submit w-full" disabled={busy || otp.length !== 6}>{busy ? "Verifying..." : "Verify email"}</Button><button type="button" onClick={() => setStep("email")} className="w-full text-xs font-semibold text-[#2468D8]">Change email address</button></form>}
    {step === "password" && <form onSubmit={updatePassword} className="space-y-5"><Field label="New password"><Input type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)}/></Field><Field label="Confirm new password"><Input type="password" required minLength={8} autoComplete="new-password" placeholder="Re-enter your password" value={confirm} onChange={e => setConfirm(e.target.value)}/></Field><Button className="auth-submit w-full" disabled={busy}>{busy ? "Updating password..." : "Update password"}</Button></form>}
    <div className="mt-7 flex items-center justify-center gap-2 text-[11px] text-slate-400">{step === "password" ? <CheckCircle2 size={14}/> : <ShieldCheck size={14}/>} Secure email verification</div>
    <Link to="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#2468D8]"><ArrowLeft size={15}/> Back to sign in</Link>
  </AuthShell>;
}
