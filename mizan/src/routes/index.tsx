import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setState } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Sign in — Mizan" }, { name: "description", content: "Sign in to your Mizan business workspace." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: email.trim().toLowerCase(), password, remember }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Invalid email or password.");
      setState(() => ({ user: data.user, business: null })); toast.success("Welcome back to Mizan!"); nav({ to: "/dashboard" });
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to sign in. Please try again."); }
    finally { setLoading(false); }
  };
  return <AuthShell title="Sign in" sub="Access your business workspace.">
    <form onSubmit={submit} className="space-y-5">
      <Field label="Email address"><div className="auth-input-wrap"><Mail size={17}/><Input type="email" autoComplete="username" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}/></div></Field>
      <Field label="Password"><div className="auth-input-wrap"><LockKeyhole size={17}/><Input type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}/><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(v => !v)} className="auth-show-password">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></Field>
      <div className="flex items-center justify-between gap-3 text-xs"><label className="flex cursor-pointer items-center gap-2 text-slate-500"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-[#2468D8]"/> Remember me</label><Link to="/forgot-password" className="font-semibold text-[#2468D8] hover:underline">Forgot password?</Link></div>
      <Button className="auth-submit w-full" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
    </form>
    <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-slate-400"><span className="h-px flex-1 bg-slate-200"/> Secure workspace <span className="h-px flex-1 bg-slate-200"/></div>
    <p className="text-center text-sm text-slate-500">New to Mizan? <Link to="/register" className="font-semibold text-[#2468D8] hover:underline">Create an account</Link></p>
    <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400"><ShieldCheck size={14}/> Protected business workspace</div>
  </AuthShell>;
}
