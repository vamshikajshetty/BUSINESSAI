import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { PageHeader, Panel, Empty, Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, setState, uid, log, daysUntil } from "@/lib/store";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({
    meta: [
      { title: "Compliance Calendar — Mizan" },
      { name: "description", content: "Track trade licence, Ejari, visa, permit and tax deadlines." },
      { property: "og:title", content: "Compliance Calendar — Mizan" },
      { property: "og:description", content: "Never miss a Dubai compliance deadline." },
    ],
  }),
  component: Calendar,
});

const TYPES = ["Trade Licence", "Ejari", "Visa", "Employee Permit", "Tax", "Other"];

function Calendar() {
  const deadlines = useStore((s) => s.deadlines);
  const [f, setF] = useState({ title: "", type: TYPES[0]!, date: "" });
  const sorted = [...deadlines].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHeader title="Compliance Calendar" sub="Dates come from your onboarding, uploaded documents and entries you add." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Add deadline">
          <form className="space-y-3" onSubmit={(e) => {
            e.preventDefault();
            setState((s) => ({ deadlines: [...s.deadlines, { id: uid(), ...f }] }));
            log("User", `Added deadline "${f.title}" on ${f.date}`);
            setF({ title: "", type: TYPES[0]!, date: "" });
          }}>
            <Field label="Title"><Input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Type">
              <select className="h-9 w-full rounded-md border bg-card px-3 text-sm" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </Field>
            <Field label="Date"><Input type="date" required value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
            <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
          </form>
        </Panel>
        <Panel title="Timeline" className="lg:col-span-2">
          {sorted.length === 0 ? <Empty icon={CalendarDays} title="No deadlines" text="Add your first compliance deadline." /> : (
            <ol className="relative space-y-4 border-l pl-6">
              {sorted.map((d) => {
                const n = daysUntil(d.date);
                return (
                  <li key={d.id} className="relative">
                    <span className={`absolute -left-[29px] top-1.5 h-3 w-3 rounded-full ${n < 0 ? "bg-destructive" : n <= 30 ? "bg-warning" : "bg-accent"}`} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.type} · {new Date(d.date).toLocaleDateString(undefined, { dateStyle: "medium" })} · {n < 0 ? `${-n} days overdue` : `in ${n} days`}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => setState((s) => ({ deadlines: s.deadlines.filter((x) => x.id !== d.id) }))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>
    </>
  );
}
