
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { PageHeader, Panel, Empty, Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useStore,
  setState,
  log,
  daysUntil,
  type Deadline,
} from "@/lib/store";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({
    meta: [
      { title: "Compliance Calendar — Mizan" },
      {
        name: "description",
        content: "Track trade licence, Ejari, visa, permit and tax deadlines.",
      },
      { property: "og:title", content: "Compliance Calendar — Mizan" },
      {
        property: "og:description",
        content: "Never miss a Dubai compliance deadline.",
      },
    ],
  }),
  component: Calendar,
});

const TYPES = [
  "Trade Licence",
  "Ejari",
  "Visa",
  "Employee Permit",
  "Tax",
  "Other",
];

function Calendar() {
  const deadlines = useStore((s) => s.deadlines);

  const [f, setF] = useState({
    title: "",
    type: TYPES[0]!,
    date: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch deadlines from MongoDB
  useEffect(() => {
    let active = true;

    async function loadDeadlines() {
      try {
        const response = await fetch("/api/deadlines");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load deadlines.");
        }

        if (active) {
          // FIX: setState expects an updater callback
          setState(() => ({
            deadlines: data.deadlines as Deadline[],
          }));
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load deadlines.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDeadlines();

    return () => {
      active = false;
    };
  }, []);

  // Sort deadlines chronologically
  const sorted = [...deadlines].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  // Add deadline to MongoDB
  async function addDeadline(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/deadlines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(f),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create deadline.",
        );
      }

      const newDeadline: Deadline = data.deadline;

      setState((s) => ({
        deadlines: [...s.deadlines, newDeadline],
      }));

      log(
        "User",
        `Added deadline "${f.title}" on ${f.date}`,
      );

      setF({
        title: "",
        type: TYPES[0]!,
        date: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create deadline.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete deadline from MongoDB
  async function deleteDeadline(id: string) {
    setError("");
    setDeletingId(id);

    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete deadline.",
        );
      }

      const deleted = deadlines.find((d) => d.id === id);

      setState((s) => ({
        deadlines: s.deadlines.filter((d) => d.id !== id),
      }));

      if (deleted) {
        log("User", `Deleted deadline "${deleted.title}"`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete deadline.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mizan-colour-page mizan-page-calendar">
      <PageHeader
        title="Compliance Calendar"
        sub="Dates come from your onboarding, uploaded documents and entries you add."
      />

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Deadline */}
        <Panel title="Add deadline">
          <form className="space-y-3" onSubmit={addDeadline}>
            <Field label="Title">
              <Input
                required
                maxLength={200}
                value={f.title}
                onChange={(e) =>
                  setF({ ...f, title: e.target.value })
                }
                placeholder="e.g. Renew trade licence"
              />
            </Field>

            <Field label="Type">
              <select
                className="h-9 w-full rounded-md border bg-card px-3 text-sm"
                value={f.type}
                onChange={(e) =>
                  setF({ ...f, type: e.target.value })
                }
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date">
              <Input
                type="date"
                required
                value={f.date}
                onChange={(e) =>
                  setF({ ...f, date: e.target.value })
                }
              />
            </Field>

            <Button type="submit" disabled={saving}>
              <Plus className="h-4 w-4" />
              {saving ? "Adding..." : "Add"}
            </Button>
          </form>
        </Panel>

        {/* Deadline Timeline */}
        <Panel title="Timeline" className="lg:col-span-2">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading compliance deadlines...
            </p>
          ) : sorted.length === 0 ? (
            <Empty
              icon={CalendarDays}
              title="No deadlines"
              text="Add your first compliance deadline."
            />
          ) : (
            <ol className="relative space-y-4 border-l pl-6">
              {sorted.map((d) => {
                const n = daysUntil(d.date);

                return (
                  <li key={d.id} className="relative">
                    <span
                      className={`absolute -left-[29px] top-1.5 h-3 w-3 rounded-full ${
                        n < 0
                          ? "bg-destructive"
                          : n <= 30
                            ? "bg-warning"
                            : "bg-accent"
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          {d.title}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {d.type} ·{" "}
                          {new Date(
                            `${d.date}T00:00:00`,
                          ).toLocaleDateString(undefined, {
                            dateStyle: "medium",
                          })}{" "}
                          ·{" "}
                          {n < 0
                            ? `${-n} days overdue`
                            : `in ${n} days`}
                        </p>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={deletingId === d.id}
                        onClick={() => deleteDeadline(d.id)}
                        aria-label={`Delete ${d.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}
