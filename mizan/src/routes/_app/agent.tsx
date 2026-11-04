
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bot,
  Check,
  X,
  Loader2,
  CircleCheck,
  Wrench,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore, setState, log } from "@/lib/store";

export const Route = createFileRoute("/_app/agent")({
  head: () => ({
    meta: [
      { title: "Agent Workspace — Mizan" },
      {
        name: "description",
        content: "An AI agent that plans compliance work and requests approval.",
      },
      { property: "og:title", content: "Agent Workspace — Mizan" },
      {
        property: "og:description",
        content: "Plan, act and verify — with human approval.",
      },
    ],
  }),
  component: Agent,
});

const STAGES = [
  "Understand",
  "Analyse",
  "Plan",
  "Use tools",
  "Take action",
  "Verify",
];

type Finding = {
  title: string;
  detail: string;
  source: string;
};

type ProposedTask = {
  title: string;
  priority: "Low" | "Medium" | "High";
  due?: string;
  reason: string;
};

type Approval = {
  id: string;
  action: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  executionStatus: string;
  createdAt?: string;
  decidedAt?: string | null;
};

type Plan = {
  summary: string;
  findings: Finding[];
  tasks: ProposedTask[];
  approvals: Approval[];
};

type Step = {
  tool: string;
  detail: string;
};

function Agent() {
  const s = useStore((x) => x);

  const [req, setReq] = useState("");
  const [stage, setStage] = useState(-1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [approvalBusy, setApprovalBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // Load persistent approvals from MongoDB on page load.
  useEffect(() => {
    let active = true;

    async function loadApprovals() {
      try {
        const response = await fetch("/api/approvals", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load approvals.");
        }

        if (active) {
          setApprovals(data.approvals);
        }
      } catch (err) {
        console.error("Load approvals error:", err);

        if (active) {
          setError("Unable to load saved approvals. Please refresh.");
        }
      }
    }

    loadApprovals();

    return () => {
      active = false;
    };
  }, []);

  const addStep = (tool: string, detail: string) => {
    setSteps((previous) => [...previous, { tool, detail }]);
  };

  // Generate an AI action plan.
  const run = async () => {
    if (!req.trim() || busy || creating) return;

    setBusy(true);
    setError("");
    setResult("");
    setPlan(null);
    setSelected([]);
    setSteps([]);
    setStage(0);

    try {
      addStep("understand_request", req.trim());

      setStage(1);
      addStep(
        "retrieve_business_records",
        "Retrieving authenticated business records from MongoDB.",
      );

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: req.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to analyse your business.");
      }

      const receivedPlan = data.plan as Plan;

      if (!receivedPlan || !Array.isArray(receivedPlan.tasks)) {
        throw new Error("Mizan returned an invalid action plan.");
      }

      setStage(2);
      setPlan(receivedPlan);
      setSelected(receivedPlan.tasks.map((_, index) => index));

      addStep(
        "analyse_business",
        `${receivedPlan.findings.length} finding(s) identified.`,
      );

      addStep(
        "generate_action_plan",
        `${receivedPlan.tasks.length} task(s) proposed and ${receivedPlan.approvals.length} approval request(s) saved.`,
      );

      // Add newly saved MongoDB approval records to the workspace.
      if (receivedPlan.approvals.length > 0) {
        setApprovals((previous) => {
          const existingIds = new Set(previous.map((item) => item.id));
          return [
            ...receivedPlan.approvals.filter(
              (item) => !existingIds.has(item.id),
            ),
            ...previous,
          ];
        });
      }

      setStage(3);
      addStep(
        "prepare_task_actions",
        "Review proposed tasks before creating them. No tasks have been created yet.",
      );

      setStage(6);

      log(
        "Agent",
        `Analysed "${req.trim()}" and generated ${receivedPlan.tasks.length} proposed task(s).`,
      );
    } catch (err) {
      console.error("Agent planning error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to run the agent.",
      );
      setStage(-1);
    } finally {
      setBusy(false);
    }
  };

  const toggleTask = (index: number) => {
    setSelected((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index],
    );
  };

  // Create selected tasks through the authenticated Tasks API.
  const createTasks = async () => {
    if (!plan || selected.length === 0 || creating) return;

    setCreating(true);
    setError("");
    setResult("");
    setStage(4);

    const createdTasks: { id: string; title: string }[] = [];

    try {
      for (const index of selected) {
        const proposed = plan.tasks[index];

        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: proposed.title,
            assignee: s.user?.name ?? "Me",
            priority: proposed.priority,
            due: proposed.due ?? "",
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || `Could not create "${proposed.title}".`,
          );
        }

        createdTasks.push(data.task);

        addStep("create_task", `Saved "${data.task.title}" to MongoDB.`);
      }

      setStage(5);
      addStep(
        "verify_saved_tasks",
        "Fetching saved tasks to verify creation.",
      );

      const verification = await fetch("/api/tasks", {
        cache: "no-store",
      });

      const verificationData = await verification.json();

      if (!verification.ok || !verificationData.success) {
        throw new Error("Tasks created, but verification failed.");
      }

      const verifiedTasks = verificationData.tasks;

      const verifiedCount = createdTasks.filter((created) =>
        verifiedTasks.some((saved: { id: string }) => saved.id === created.id),
      ).length;

      setState(() => ({ tasks: verifiedTasks }));

      if (verifiedCount !== createdTasks.length) {
        throw new Error(
          `Only ${verifiedCount} of ${createdTasks.length} tasks were verified.`,
        );
      }

      setStage(6);
      setResult(
        `Successfully created and verified ${verifiedCount} task(s) in MongoDB.`,
      );

      addStep(
        "verification_complete",
        `${verifiedCount} task(s) confirmed in MongoDB.`,
      );

      log("Agent", `Created and verified ${verifiedCount} task(s).`);
      setSelected([]);
    } catch (err) {
      console.error("Task execution error:", err);

      setError(
        err instanceof Error ? err.message : "Task creation failed.",
      );

      try {
        const refresh = await fetch("/api/tasks", {
          cache: "no-store",
        });
        const data = await refresh.json();

        if (refresh.ok && data.success) {
          setState(() => ({ tasks: data.tasks }));
        }
      } catch (refreshError) {
        console.error("Task refresh error:", refreshError);
      }
    } finally {
      setCreating(false);
    }
  };

  // Persist approval or rejection in MongoDB.
  const decide = async (
    approval: Approval,
    status: "Approved" | "Rejected",
  ) => {
    if (approvalBusy || approval.status !== "Pending") return;

    setApprovalBusy(approval.id);
    setError("");

    try {
      const response = await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: approval.id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update approval.");
      }

      setApprovals((previous) =>
        previous.map((item) =>
          item.id === approval.id
            ? {
                ...item,
                status,
                decidedAt: new Date().toISOString(),
                executionStatus: "Not executed",
              }
            : item,
        ),
      );

      log("User", `${status} approval: "${approval.action}"`);

      if (status === "Approved") {
        log(
          "Agent",
          `Approval granted for "${approval.action}". External action has NOT been executed.`,
        );
      }
    } catch (err) {
      console.error("Approval decision error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your decision.",
      );
    } finally {
      setApprovalBusy(null);
    }
  };

  const pendingCount = approvals.filter(
    (item) => item.status === "Pending",
  ).length;

  return (
    <>
      <PageHeader
        title="Agent Workspace"
        sub="AI-powered business analysis, task planning and human-approved actions."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="New request" className="lg:col-span-2">
          <Textarea
            value={req}
            onChange={(e) => setReq(e.target.value)}
            rows={3}
            placeholder="e.g. Analyse my business compliance and create the important tasks."
            disabled={busy || creating}
          />

          <Button
            className="mt-3"
            onClick={run}
            disabled={!req.trim() || busy || creating}
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
            {busy ? "Analysing..." : "Run agent"}
          </Button>

          <div className="mt-6 flex flex-wrap gap-2">
            {STAGES.map((name, index) => (
              <span
                key={name}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  stage > index
                    ? "bg-success/15 text-success"
                    : stage === index
                      ? "bg-accent/15 text-accent"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {stage > index && <CircleCheck className="h-3 w-3" />}
                {name}
              </span>
            ))}
          </div>

          {steps.length > 0 && (
            <div className="mt-5 space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm"
                >
                  <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <code className="text-xs font-semibold">{step.tool}</code>
                    <p className="text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 flex gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success">
              <CircleCheck className="h-4 w-4 shrink-0" />
              {result}
            </div>
          )}

          {plan && (
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-semibold">Agent analysis</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {plan.summary}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  Findings ({plan.findings.length})
                </h3>

                {plan.findings.map((finding, index) => (
                  <div key={index} className="mt-3 rounded-lg border p-3">
                    <p className="text-sm font-medium">{finding.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {finding.detail}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Source: {finding.source}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold">
                    Proposed tasks ({plan.tasks.length})
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {selected.length} selected
                  </span>
                </div>

                {plan.tasks.map((task, index) => (
                  <label
                    key={index}
                    className="mt-3 flex cursor-pointer gap-3 rounded-lg border p-3"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(index)}
                      onChange={() => toggleTask(index)}
                      disabled={creating}
                      className="mt-1"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {task.reason}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-muted px-2 py-1">
                          {task.priority} priority
                        </span>
                        {task.due && (
                          <span className="rounded-full bg-muted px-2 py-1">
                            Due: {task.due}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}

                {plan.tasks.length > 0 && (
                  <Button
                    className="mt-4"
                    onClick={createTasks}
                    disabled={selected.length === 0 || creating}
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ClipboardList className="h-4 w-4" />
                    )}
                    {creating
                      ? "Creating and verifying..."
                      : `Create ${selected.length} selected task(s)`}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Panel>

        <Panel title={`External action approvals (${pendingCount} pending)`}>
          {approvals.length === 0 ? (
            <Empty
              icon={Check}
              title="No approvals"
              text="Actions requiring your sign-off will appear here."
            />
          ) : (
            <ul className="space-y-3">
              {approvals.map((approval) => (
                <li key={approval.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{approval.action}</p>

                  {approval.reason && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {approval.reason}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    Execution: {approval.executionStatus}
                  </p>

                  {approval.status === "Pending" ? (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => decide(approval, "Approved")}
                        disabled={approvalBusy !== null}
                      >
                        {approvalBusy === approval.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decide(approval, "Rejected")}
                        disabled={approvalBusy !== null}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <p
                      className={`mt-2 text-xs font-medium ${
                        approval.status === "Approved"
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {approval.status}
                    </p>
                  )}

                  {approval.decidedAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Decision saved:{" "}
                      {new Date(approval.decidedAt).toLocaleString()}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    Approval does not execute the external action.
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
