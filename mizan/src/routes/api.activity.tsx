
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { History, Bot, User } from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { useStore, setState } from "@/lib/store";

export const Route = createFileRoute("/api/activity")({
  head: () => ({
    meta: [
      { title: "Activity Centre — Mizan" },
      { name: "description", content: "Audit trail of agent actions and user approvals." },
      { property: "og:title", content: "Activity Centre — Mizan" },
      { property: "og:description", content: "Every action, logged." },
    ],
  }),
  component: Activity,
});

function Activity() {
  const activity = useStore((s) => s.activity);
  const [who, setWho] = useState<"All" | "User" | "Agent">("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadActivity() {
      try {
        const response = await fetch("/api/activity");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load activity.");
        }

        if (active) {
          setState(() => ({
            activity: data.activities,
          }));
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load activity.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadActivity();

    return () => {
      active = false;
    };
  }, []);

  const list = activity.filter(
    (a) => who === "All" || a.actor === who,
  );

  return (
    <>
      <PageHeader
        title="Activity Centre"
        sub="Audit trail of everything you and the agent did."
      />

      <div className="mb-4 flex gap-2">
        {(["All", "User", "Agent"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWho(w)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              who === w
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-muted-foreground"
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      <Panel>
        {error ? (
          <p className="py-6 text-sm text-destructive">{error}</p>
        ) : loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading activity history...
          </p>
        ) : list.length === 0 ? (
          <Empty
            icon={History}
            title="No activity"
            text="Nothing logged yet."
          />
        ) : (
          <ul className="divide-y">
            {list.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 py-3 text-sm"
              >
                <div
                  className={`rounded-full p-1.5 ${
                    a.actor === "Agent"
                      ? "bg-accent/10 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {a.actor === "Agent" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                <span className="flex-1">{a.text}</span>

                <span className="text-xs text-muted-foreground">
                  {new Date(a.at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
