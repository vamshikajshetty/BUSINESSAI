import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, ListChecks, Loader2 } from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, setState, log, type Task } from "@/lib/store";
import { toast } from "sonner";

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

const priTone = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-muted text-muted-foreground",
};

const sel = "h-9 rounded-md border bg-card px-2 text-sm";

function Tasks() {
  const { tasks, user } = useStore((s) => s);

  const [f, setF] = useState({
    title: "",
    assignee: "",
    priority: "Medium" as Task["priority"],
    due: "",
  });

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [busyIds, setBusyIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load tasks.");
        }

        if (active) {
          setState(() => ({ tasks: data.tasks }));
        }
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Unable to load tasks.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);
  function setBusy(id: string, busy: boolean) {
    setBusyIds((current) =>
      busy ? [...current, id] : current.filter((item) => item !== id),
    );
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) return;

    setAdding(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: f.title.trim(),
          assignee: f.assignee.trim() || user?.name || "Unassigned",
          priority: f.priority,
          due: f.due,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create task.");
      }

      setState((s) => ({ tasks: [data.task, ...s.tasks] }));
      log("User", `Created task "${data.task.title}"`);

      setF({
        title: "",
        assignee: "",
        priority: "Medium",
        due: "",
      });

      toast.success("Task created successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create task.",
      );
    } finally {
      setAdding(false);
    }
  }
  async function updateTask(id: string, updates: Partial<Task>) {
    setBusy(id, true);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update task.");
      }

      setState((s) => ({
        tasks: s.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task,
        ),
      }));

      if (updates.status) {
        const task = tasks.find((item) => item.id === id);
        log("User", `Moved "${task?.title ?? "Task"}" to ${updates.status}`);
      }

      toast.success("Task updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Update failed.",
      );
    } finally {
      setBusy(id, false);
    }
  }
  async function deleteTask(id: string) {
    if (!window.confirm("Delete this task permanently?")) return;

    setBusy(id, true);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete task.");
      }

      setState((s) => ({
        tasks: s.tasks.filter((task) => task.id !== id),
      }));

      log("User", "Deleted a task");
      toast.success("Task deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Delete failed.",
      );
    } finally {
      setBusy(id, false);
    }
  }
  return (
    <div className="mizan-colour-page mizan-page-tasks">
      <PageHeader title="Tasks" />

      <Panel className="mb-6">
        <form className="flex flex-wrap gap-2" onSubmit={addTask}>
          <Input
            required
            placeholder="Task title"
            className="min-w-56 flex-1"
            value={f.title}
            onChange={(e) => setF({ ...f, title: e.target.value })}
          />

          <Input
            placeholder="Assignee"
            className="w-40"
            value={f.assignee}
            onChange={(e) => setF({ ...f, assignee: e.target.value })}
          />

          <select
            className={sel}
            value={f.priority}
            onChange={(e) =>
              setF({ ...f, priority: e.target.value as Task["priority"] })
            }
          >
            {PRI.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>

          <Input
            type="date"
            className="w-40"
            value={f.due}
            onChange={(e) => setF({ ...f, due: e.target.value })}
          />

          <Button type="submit" disabled={adding}>
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {adding ? "Adding..." : "Add"}
          </Button>
        </form>
      </Panel>
      {loading ? (
        <Panel>
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading tasks from MongoDB...
          </div>
        </Panel>
      ) : tasks.length === 0 ? (
        <Empty
          icon={ListChecks}
          title="No tasks yet"
          text="Create a task above or let the agent generate them."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map((status) => (
            <div key={status} className="rounded-xl border border-[#E8CF70] bg-[#FFF4C2] p-3">
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-[#765600]">
                {status} · {tasks.filter((task) => task.status === status).length}
              </p>

              <div className="space-y-2">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => {
                    const busy = busyIds.includes(task.id);

                    return (
                      <div
                        key={task.id}
                        className="rounded-lg border bg-card p-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${
                              task.status === "Done"
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>
                          <button
                            disabled={busy}
                            onClick={() => deleteTask(task.id)}
                            aria-label="Delete"
                            className="disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {task.assignee}
                          {task.due && ` · due ${task.due}`}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <select
                            className="rounded border bg-card px-1 py-0.5 text-xs"
                            value={task.priority}
                            disabled={busy}
                            onChange={(e) =>
                              updateTask(task.id, {
                                priority: e.target.value as Task["priority"],
                              })
                            }
                          >
                            {PRI.map((priority) => (
                              <option key={priority}>{priority}</option>
                            ))}
                          </select>
                          <select
                            className="ml-auto rounded border bg-card px-1 py-0.5 text-xs"
                            value={task.status}
                            disabled={busy}
                            onChange={(e) =>
                              updateTask(task.id, {
                                status: e.target.value as Task["status"],
                              })
                            }
                          >
                            {STATUSES.map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
       </div>
  );
}
      
