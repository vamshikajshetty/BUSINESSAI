import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Bot, User } from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/activity")({
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
  const list = activity.filter((a) => who === "All" || a.actor === who);
  return (
    <>
      <PageHeader title="Activity Centre" sub="Audit trail of everything you and the agent did." />
      <div className="mb-4 flex gap-2">
        {(["All", "User", "Agent"] as const).map((w) => (
          <button key={w} onClick={() => setWho(w)} className={`rounded-full px-3 py-1 text-xs font-medium ${who === w ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground"}`}>{w}</button>
        ))}
      </div>
      <Panel>
        {list.length === 0 ? <Empty icon={History} title="No activity" text="Nothing logged yet." /> : (
          <ul className="divide-y">
            {list.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3 text-sm">
                <div className={`rounded-full p-1.5 ${a.actor === "Agent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>{a.actor === "Agent" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}</div>
                <span className="flex-1">{a.text}</span>
                <span className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
