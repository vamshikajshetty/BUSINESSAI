import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/kit";
import { BusinessForm } from "@/components/BusinessForm";
import { Button } from "@/components/ui/button";
import { useStore, setState, log, resetAll } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Business Profile — Mizan" },
      { name: "description", content: "Manage your business and trade licence details." },
      { property: "og:title", content: "Business Profile — Mizan" },
      { property: "og:description", content: "Your Dubai business details in one place." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { business, user, docs } = useStore((s) => s);
  const nav = useNavigate();
  return (
    <>
      <PageHeader title="Business Profile" sub={`${user?.name} · ${user?.email} · ${docs.length} document(s)`} />
      <Panel title="Business details">
        <BusinessForm
          initial={business}
          cta="Save changes"
          onSave={(b) => {
            setState((s) => ({
              business: b,
              deadlines: [...s.deadlines.filter((d) => d.title !== "Trade licence renewal"), { id: "licence", title: "Trade licence renewal", type: "Trade Licence", date: b.licenceExpiry }],
            }));
            log("User", "Updated business profile");
            toast.success("Profile saved");
          }}
        />
      </Panel>
      <Panel title="Danger zone" className="mt-6">
        <Button variant="destructive" onClick={() => { if (confirm("Delete all data in this browser?")) { resetAll(); nav({ to: "/" }); } }}>Delete account & data</Button>
      </Panel>
    </>
  );
}
