import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setState, log } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Mizan" },
      { name: "description", content: "Create your Mizan workspace for your Dubai business." },
      { property: "og:title", content: "Create account — Mizan" },
      { property: "og:description", content: "Start tracking licences, documents and deadlines." },
    ],
  }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setState(() => ({ user: { name: f.name.trim(), email: f.email.trim().toLowerCase() } }));
    log("User", "Created account");
    nav({ to: "/onboarding" });
  };
  return (
    <AuthShell title="Create your account" sub="Takes under a minute">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name"><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Work email"><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Password (min 8 characters)"><Input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
        <Button className="w-full" type="submit">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Have an account? <Link to="/" className="font-medium text-accent hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
