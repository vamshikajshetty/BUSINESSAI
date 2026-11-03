import { useSyncExternalStore } from "react";

// Local-first store (browser localStorage). Swap these helpers for API calls
// to the Express/MongoDB backend when running the full stack.
export type User = { name: string; email: string };
export type Business = {
  name: string;
  activity: string;
  location: string;
  authority: string;
  licenceNo: string;
  licenceExpiry: string;
  employees: number;
};
export type Doc = {
  id: string;
  name: string;
  size: number;
  category: string;
  expiry?: string;
  uploadedAt: string;
  url?: string;
};
export type Task = {
  id: string;
  title: string;
  assignee: string;
  priority: "Low" | "Medium" | "High";
  status: "To do" | "In progress" | "Done";
  due?: string;
};
export type Deadline = { id: string; title: string; type: string; date: string };
export type ChatMsg = { role: "user" | "assistant"; content: string };
export type Activity = { id: string; at: string; actor: "User" | "Agent"; text: string };
export type Approval = { id: string; action: string; status: "Pending" | "Approved" | "Rejected" };

type State = {
  user: User | null;
  business: Business | null;
  docs: Doc[];
  tasks: Task[];
  deadlines: Deadline[];
  chat: ChatMsg[];
  activity: Activity[];
  approvals: Approval[];
};

const KEY = "dubai-ops-state";
const empty: State = {
  user: null,
  business: null,
  docs: [],
  tasks: [],
  deadlines: [],
  chat: [],
  activity: [],
  approvals: [],
};

let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

export function setState(fn: (s: State) => Partial<State>) {
  load();
  state = { ...state, ...fn(state) };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return sel(state);
    },
    () => sel(empty),
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function log(actor: Activity["actor"], text: string) {
  setState((s) => ({
    activity: [{ id: uid(), at: new Date().toISOString(), actor, text }, ...s.activity],
  }));
}

export function resetAll() {
  state = empty;
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export function classify(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("licen")) return "Trade Licence";
  if (n.includes("ejari") || n.includes("tenancy")) return "Ejari";
  if (n.includes("visa")) return "Visa";
  if (n.includes("permit")) return "Employee Permit";
  if (n.includes("vat") || n.includes("tax") || n.includes("trn")) return "Tax";
  if (n.includes("moa") || n.includes("memorandum")) return "MOA";
  return "Other";
}

export const REQUIRED_DOCS = ["Trade Licence", "Ejari", "MOA", "Tax"];
