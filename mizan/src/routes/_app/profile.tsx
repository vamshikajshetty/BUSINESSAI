
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, Panel } from "@/components/kit";
import { BusinessForm } from "@/components/BusinessForm";
import { useStore, setState, log } from "@/lib/store";
import type { Business } from "@/lib/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Business Profile — Mizan" },
      {
        name: "description",
        content: "Manage your business and trade licence details.",
      },
      { property: "og:title", content: "Business Profile — Mizan" },
      {
        property: "og:description",
        content: "Your Dubai business details in one place.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { business, user, docs } = useStore((s) => s);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadBusiness() {
      try {
        const response = await fetch("/api/business", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load business profile.");
        }

        if (active && data.business) {
          setState(() => ({
            business: data.business,
          }));
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load business profile.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBusiness();

    return () => {
      active = false;
    };
  }, []);

  async function saveBusiness(updatedBusiness: Business) {
    try {
      const response = await fetch("/api/business", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBusiness),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save business profile.");
      }

      const savedBusiness = data.business as Business;

      setState((s) => ({
        business: savedBusiness,
        deadlines: [
          ...s.deadlines.filter(
            (d) => d.id !== "licence",
          ),
          {
            id: "licence",
            title: "Trade licence renewal",
            type: "Trade Licence",
            date: savedBusiness.licenceExpiry,
          },
        ],
      }));

      log("User", "Updated business profile");
      toast.success("Business profile saved successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save business profile.",
      );
      throw error;
    }
  }

  return (
    <>
      <PageHeader
        title="Business Profile"
        sub={`${user?.name ?? ""} · ${user?.email ?? ""} · ${docs.length} document(s)`}
      />

      <Panel title="Business details">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading business details...
          </div>
        ) : (
          <BusinessForm
            key={business?.name ?? "new-business"}
            initial={business}
            cta="Save changes"
            onSave={saveBusiness}
          />
        )}
      </Panel>
    </>
  );
}
