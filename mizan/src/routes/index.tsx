import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setState, useStore, log } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Mizan" },
      { name: "description", content: "Sign in to manage your Dubai business compliance." },
      { property: "og:title", content: "Sign in — Mizan" },
      { property: "og:description", content: "Compliance and operations for Dubai SMEs." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const user = useStore((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.email !== email.trim().toLowerCase()) {
      toast.error("No account found for that email. Create one first.");
      return;
    }
    if (password.length < 8) { toast.error("Incorrect password."); return; }
    log("User", "Signed in");
    setState(() => ({}));
    nav({ to: "/dashboard" });
  };

  return (
    <AuthShell title="Welcome back" sub="Sign in to your workspace">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <button type="button" onClick={() => toast.info("Password reset email is sent by the backend when running the full stack.")} className="text-xs text-accent hover:underline">
          Forgot password?
        </button>
        <Button className="w-full" type="submit">Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/register" className="font-medium text-accent hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
