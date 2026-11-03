import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BusinessForm } from "@/components/BusinessForm";
import { setState, log } from "@/lib/store";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your business — Mizan" },
      { name: "description", content: "Tell us about your Dubai business to personalise compliance tracking." },
      { property: "og:title", content: "Business onboarding — Mizan" },
      { property: "og:description", content: "Add your trade licence and business details." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-accent/10 p-2.5 text-accent"><Building2 className="h-5 w-5" /></div>
          <div>
            <h1 className="text-xl font-semibold">Set up your business</h1>
            <p className="text-sm text-muted-foreground">We use this to build your compliance calendar.</p>
          </div>
        </div>
        <BusinessForm
          cta="Continue to dashboard"
          onSave={(b) => {
            setState((s) => ({
              business: b,
              deadlines: [{ id: "licence", title: "Trade licence renewal", type: "Trade Licence", date: b.licenceExpiry }, ...s.deadlines],
            }));
            log("User", `Completed onboarding for ${b.name}`);
            nav({ to: "/dashboard" });
          }}
        />
      </div>
    </div>
  );
}
