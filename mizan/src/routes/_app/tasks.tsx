import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, setState, uid, log, type Task } from "@/lib/store";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Mizan" },
      { name: "description", content: "Create, assign, prioritise and track business tasks." },
      { property: "og:title", content: "Tasks — Mizan" },
      { property: "og:description", content: "A task board for compliance and operations." },
    ],
  }),
  component: Tasks,
});

const STATUSES: Task["status"][] = ["To do", "In progress", "Done"];
const PRI: Task["priority"][] = ["Low", "Medium", "High"];
const priTone = { High: "bg-destructive/10 text-destructive", Medium: "bg-warning/15 text-warning", Low: "bg-muted text-muted-foreground" };
const sel = "h-9 rounded-md border bg-card px-2 text-sm";

function Tasks() {
  const { tasks, user } = useStore((s) => s);
  const [f, setF] = useState({ title: "", assignee: "", priority: "Medium" as Task["priority"], due: "" });
  const upd = (id: string, p: Partial<Task>) => setState((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...p } : t)) }));

  return (
    <>
      <PageHeader title="Tasks" />
      <Panel className="mb-6">
        <form className="flex flex-wrap gap-2" onSubmit={(e) => {
          e.preventDefault();
          setState((s) => ({ tasks: [{ id: uid(), title: f.title, assignee: f.assignee || user!.name, priority: f.priority, status: "To do", ...(f.due ? { due: f.due } : {}) }, ...s.tasks] }));
          log("User", `Created task "${f.title}"`);
          setF({ ...f, title: "", due: "" });
        }}>
          <Input required placeholder="Task title" className="min-w-56 flex-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <Input placeholder="Assignee" className="w-40" value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })} />
          <select className={sel} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Task["priority"] })}>{PRI.map((p) => <option key={p}>{p}</option>)}</select>
          <Input type="date" className="w-40" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} />
          <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
        </form>
      </Panel>
      {tasks.length === 0 ? <Empty icon={ListChecks} title="No tasks yet" text="Create a task above or let the agent generate them." /> : (
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map((st) => (
            <div key={st} className="rounded-xl bg-muted/60 p-3">
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{st} · {tasks.filter((t) => t.status === st).length}</p>
              <div className="space-y-2">
                {tasks.filter((t) => t.status === st).map((t) => (
                  <div key={t.id} className="rounded-lg border bg-card p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${t.status === "Done" ? "text-muted-foreground line-through" : ""}`}>{t.title}</p>
                      <button onClick={() => setState((s) => ({ tasks: s.tasks.filter((x) => x.id !== t.id) }))} aria-label="Delete"><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.assignee}{t.due && ` · due ${t.due}`}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${priTone[t.priority]}`}>{t.priority}</span>
                      <select className="ml-auto rounded border bg-card px-1 py-0.5 text-xs" value={t.status} onChange={(e) => { upd(t.id, { status: e.target.value as Task["status"] }); log("User", `Moved "${t.title}" to ${e.target.value}`); }}>
                        {STATUSES.map((x) => <option key={x}>{x}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
