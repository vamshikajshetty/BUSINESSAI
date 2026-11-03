import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Check, X, Loader2, CircleCheck, Wrench } from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore, setState, uid, log, daysUntil, REQUIRED_DOCS } from "@/lib/store";

export const Route = createFileRoute("/_app/agent")({
  head: () => ({
    meta: [
      { title: "Agent Workspace — Mizan" },
      { name: "description", content: "An agent that plans compliance work, creates tasks and asks for approval." },
      { property: "og:title", content: "Agent Workspace — Mizan" },
      { property: "og:description", content: "Plan, act and verify — with human approval." },
    ],
  }),
  component: Agent,
});

const STAGES = ["Understand", "Analyse", "Plan", "Use tools", "Take action", "Verify"];
type Step = { tool: string; detail: string };

function Agent() {
  const s = useStore((x) => x);
  const [req, setReq] = useState("");
  const [stage, setStage] = useState(-1);
  const [steps, setSteps] = useState<Step[]>([]);

  const run = async () => {
    if (!req.trim()) return;
    const out: Step[] = [];
    const push = async (i: number, st?: Step) => {
      setStage(i);
      if (st) { out.push(st); setSteps([...out]); }
      await new Promise((r) => setTimeout(r, 500));
    };
    setSteps([]);
    await push(0, { tool: "parse_request", detail: `"${req.trim()}"` });
    const have = new Set(s.docs.map((d) => d.category));
    const missing = REQUIRED_DOCS.filter((r) => !have.has(r));
    await push(1, { tool: "detect_missing_documents", detail: missing.length ? `Missing: ${missing.join(", ")}` : "None missing" });
    const soon = s.deadlines.filter((d) => daysUntil(d.date) <= 60);
    await push(1, { tool: "detect_expiry", detail: `${soon.length} deadline(s) within 60 days` });
    await push(2, { tool: "plan", detail: `Create ${missing.length + soon.length} task(s); draft a reminder email; request approval to send` });
    const newTasks = [
      ...missing.map((m) => ({ id: uid(), title: `Upload ${m}`, assignee: s.user?.name ?? "Me", priority: "High" as const, status: "To do" as const })),
      ...soon.map((d) => ({ id: uid(), title: `Prepare: ${d.title}`, assignee: s.user?.name ?? "Me", priority: "Medium" as const, status: "To do" as const, due: d.date })),
    ];
    await push(3, { tool: "create_tasks", detail: `${newTasks.length} task(s) created` });
    await push(3, { tool: "draft_email", detail: "Drafted reminder to business owner (simulated)" });
    const approval = { id: uid(), action: "Send drafted compliance reminder email (SIMULATED)", status: "Pending" as const };
    setState((st) => ({ tasks: [...newTasks, ...st.tasks], approvals: [approval, ...st.approvals] }));
    log("Agent", `Ran request "${req.trim()}" — created ${newTasks.length} task(s), requested 1 approval`);
    await push(4, { tool: "request_approval", detail: "Waiting for your approval below" });
    await push(5, { tool: "verify", detail: "Tasks and approval saved to your workspace" });
    setStage(6);
  };

  const decide = (id: string, status: "Approved" | "Rejected") => {
    setState((st) => ({ approvals: st.approvals.map((a) => (a.id === id ? { ...a, status } : a)) }));
    const a = s.approvals.find((x) => x.id === id);
    log("User", `${status} "${a?.action}"`);
    if (status === "Approved") log("Agent", `Executed simulated action: ${a?.action}`);
  };

  return (
    <>
      <PageHeader title="Agent Workspace" sub="Simulated actions only. Government submissions and payments always require your approval." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="New request" className="lg:col-span-2">
          <Textarea value={req} onChange={(e) => setReq(e.target.value)} rows={3} placeholder="e.g. Check what I need for my licence renewal and create tasks" />
          <Button className="mt-3" onClick={run} disabled={stage >= 0 && stage < 6}>
            {stage >= 0 && stage < 6 ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} Run agent
          </Button>
          <div className="mt-6 flex flex-wrap gap-2">
            {STAGES.map((n, i) => (
              <span key={n} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${stage > i ? "bg-success/15 text-success" : stage === i ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                {stage > i && <CircleCheck className="h-3 w-3" />}{n}
              </span>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {steps.map((st, i) => (
              <div key={i} className="flex gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div><code className="text-xs font-semibold">{st.tool}</code><p className="text-muted-foreground">{st.detail}</p></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Approvals">
          {s.approvals.length === 0 ? <Empty icon={Check} title="No approvals" text="Actions needing your sign-off appear here." /> : (
            <ul className="space-y-3">
              {s.approvals.map((a) => (
                <li key={a.id} className="rounded-lg border p-3 text-sm">
                  <p>{a.action}</p>
                  {a.status === "Pending" ? (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => decide(a.id, "Approved")}><Check className="h-3.5 w-3.5" /> Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => decide(a.id, "Rejected")}><X className="h-3.5 w-3.5" /> Reject</Button>
                    </div>
                  ) : <p className={`mt-1 text-xs font-medium ${a.status === "Approved" ? "text-success" : "text-destructive"}`}>{a.status}</p>}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
