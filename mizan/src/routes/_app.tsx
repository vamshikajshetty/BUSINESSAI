import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, MessageSquare, Bot, FolderLock, CalendarDays, ListChecks, Building2, History, LogOut, ShieldCheck, Menu,
} from "lucide-react";
import { useStore, log } from "@/lib/store";

export const Route = createFileRoute("/_app")({ component: AppLayout });

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI Assistant", icon: MessageSquare },
  { to: "/agent", label: "Agent Workspace", icon: Bot },
  { to: "/documents", label: "Document Vault", icon: FolderLock },
  { to: "/calendar", label: "Compliance Calendar", icon: CalendarDays },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/profile", label: "Business Profile", icon: Building2 },
  { to: "/activity", label: "Activity Centre", icon: History },
] as const;

function AppLayout() {
  const user = useStore((s) => s.user);
  const business = useStore((s) => s.business);
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (!user) nav({ to: "/" });
    else if (!business) nav({ to: "/onboarding" });
  }, [ready, user, business, nav]);

  if (!ready || !user || !business) return null;

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:flex lg:translate-x-0 ${open ? "flex translate-x-0" : "hidden -translate-x-full"}`}>
        <div className="flex items-center gap-2 px-6 py-5 text-lg font-semibold text-sidebar-accent-foreground">
          <ShieldCheck className="h-6 w-6 text-sidebar-primary" /> Mizan
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
          <p className="truncate text-xs">{business.name}</p>
          <button
            onClick={() => { log("User", "Signed out"); nav({ to: "/" }); }}
            className="mt-3 flex items-center gap-2 text-xs hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b bg-card px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Menu"><Menu className="h-5 w-5" /></button>
          <span className="font-semibold">Mizan</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
