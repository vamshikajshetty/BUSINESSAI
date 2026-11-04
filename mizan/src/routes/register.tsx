import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setState } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Mizan" },
      {
        name: "description",
        content: "Create your Mizan workspace for your Dubai business.",
      },
      { property: "og:title", content: "Create account — Mizan" },
      {
        property: "og:description",
        content: "Start tracking licences, documents and deadlines.",
      },
    ],
  }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (f.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!f.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: f.name.trim(),
          email: f.email.trim().toLowerCase(),
          password: f.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setState(() => ({
        user: data.user,
        business: null,
      }));

      toast.success("Account created successfully!");
      nav({ to: "/onboarding" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" sub="Takes under a minute">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <Input
            required
            value={f.name}
            onChange={(e) =>
              setF({ ...f, name: e.target.value })
            }
          />
        </Field>

        <Field label="Work email">
          <Input
            type="email"
            required
            value={f.email}
            onChange={(e) =>
              setF({ ...f, email: e.target.value })
            }
          />
        </Field>

        <Field label="Password (min 8 characters)">
          <Input
            type="password"
            required
            minLength={8}
            value={f.password}
            onChange={(e) =>
              setF({ ...f, password: e.target.value })
            }
          />
        </Field>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Have an account?{" "}
        <Link
          to="/"
          className="font-medium text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}