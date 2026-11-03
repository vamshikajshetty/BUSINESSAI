import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, CalendarClock, FileWarning, ListChecks, Hourglass, History } from "lucide-react";
import { PageHeader, Panel, Stat, Empty } from "@/components/kit";
import { useStore, daysUntil, REQUIRED_DOCS } from "@/lib/store";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Mizan" },
      { name: "description", content: "Your compliance score, renewals, tasks and approvals at a glance." },
      { property: "og:title", content: "Dashboard — Mizan" },
      { property: "og:description", content: "Compliance overview for your Dubai business." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, docs, tasks, deadlines, approvals, activity } = useStore((s) => s);
  const have = new Set(docs.map((d) => d.category));
  const missing = REQUIRED_DOCS.filter((r) => !have.has(r));
  const upcoming = deadlines.filter((d) => daysUntil(d.date) >= 0 && daysUntil(d.date) <= 90).sort((a, b) => a.date.localeCompare(b.date));
  const overdue = deadlines.filter((d) => daysUntil(d.date) < 0).length;
  const active = tasks.filter((t) => t.status !== "Done");
  const pending = approvals.filter((a) => a.status === "Pending");
  const score = Math.max(0, Math.round(((REQUIRED_DOCS.length - missing.length) / REQUIRED_DOCS.length) * 100 - overdue * 15));
  const done = tasks.filter((t) => t.status === "Done").length;

  return (
    <>
      <PageHeader title={`Good day, ${user?.name.split(" ")[0]}`} sub="Everything below is calculated from your own data." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat icon={ShieldCheck} label="Compliance score" value={`${score}%`} />
        <Stat icon={CalendarClock} label="Renewals in 90 days" value={upcoming.length} tone="warning" />
        <Stat icon={FileWarning} label="Missing documents" value={missing.length} tone="destructive" />
        <Stat icon={ListChecks} label="Active tasks" value={active.length} tone="primary" />
        <Stat icon={Hourglass} label="Pending approvals" value={pending.length} tone="warning" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Upcoming renewals" className="lg:col-span-2">
          {upcoming.length === 0 ? (
            <Empty icon={CalendarClock} title="Nothing due in the next 90 days" text="Add deadlines in the calendar or upload documents with expiry dates." />
          ) : (
            <ul className="divide-y">
              {upcoming.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3 text-sm">
                  <div><p className="font-medium">{d.title}</p><p className="text-xs text-muted-foreground">{d.type}</p></div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${daysUntil(d.date) <= 30 ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"}`}>
                    {daysUntil(d.date)} days
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Missing documents">
          {missing.length === 0 ? (
            <p className="text-sm text-success">All core documents uploaded.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {missing.map((m) => <li key={m} className="flex items-center gap-2"><FileWarning className="h-4 w-4 text-destructive" />{m}</li>)}
              <li><Link to="/documents" className="text-xs font-medium text-accent hover:underline">Upload documents →</Link></li>
            </ul>
          )}
        </Panel>
        <Panel title="Task progress">
          {tasks.length === 0 ? <p className="text-sm text-muted-foreground">No tasks yet.</p> : (
            <>
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-accent" style={{ width: `${(done / tasks.length) * 100}%` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{done} of {tasks.length} completed</p>
            </>
          )}
        </Panel>
        <Panel title="Recent activity" className="lg:col-span-2">
          {activity.length === 0 ? <Empty icon={History} title="No activity yet" text="Actions you and the agent take appear here." /> : (
            <ul className="space-y-2 text-sm">
              {activity.slice(0, 6).map((a) => (
                <li key={a.id} className="flex justify-between gap-4"><span><b className="font-medium">{a.actor}:</b> {a.text}</span><span className="shrink-0 text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</span></li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
