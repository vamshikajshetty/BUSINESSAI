
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, MessageSquare, Bot, FolderLock, CalendarDays,
  ListChecks, Building2, History, LogOut, Menu, X, Search,
  Bell, ChevronDown, Settings2, ChartNoAxesCombined, ShieldCheck,
} from "lucide-react";
import { useStore, setState } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app")({ component: AppLayout });

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "WORKSPACE" },
  { to: "/agent", label: "Agent workspace", icon: Bot, group: "WORKSPACE", tag: "AI" },
  { to: "/chat", label: "AI assistant", icon: MessageSquare, group: "WORKSPACE" },
  { to: "/tasks", label: "Tasks", icon: ListChecks, group: "MANAGE" },
  { to: "/documents", label: "Document vault", icon: FolderLock, group: "MANAGE" },
  { to: "/calendar", label: "Compliance calendar", icon: CalendarDays, group: "MANAGE" },
  { to: "/profile", label: "Business profile", icon: Building2, group: "BUSINESS" },
  { to: "/activity", label: "Activity centre", icon: History, group: "BUSINESS" },
] as const;

function AppLayout() {
  const user = useStore((s) => s.user);
  const business = useStore((s) => s.business);
  const tasks = useStore((s) => s.tasks);
  const docs = useStore((s) => s.docs);
  const deadlines = useStore((s) => s.deadlines);
  const approvals = useStore((s) => s.approvals);
  const nav = useNavigate();

  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const today = new Date();

  const daysUntil = (date: string) =>
    Math.ceil(
      (
        new Date(`${date.slice(0, 10)}T00:00:00`).getTime() -
        new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      ) / 86400000
    );

  const notifications = [
    ...deadlines
      .filter((item) => daysUntil(item.date) <= 14)
      .map((item) => ({
        title: item.title,
        detail:
          daysUntil(item.date) < 0
            ? `${Math.abs(daysUntil(item.date))} days overdue`
            : daysUntil(item.date) === 0
              ? "Due today"
              : `Due in ${daysUntil(item.date)} days`,
        href: "/calendar" as const,
        tone: daysUntil(item.date) <= 3 ? "urgent" : "amber",
      })),

    ...docs
      .filter((item) => item.expiry && daysUntil(item.expiry) <= 30)
      .map((item) => ({
        title: `${item.name} expiry`,
        detail:
          daysUntil(item.expiry!) < 0
            ? "Document expired"
            : `Expires in ${daysUntil(item.expiry!)} days`,
        href: "/documents" as const,
        tone: daysUntil(item.expiry!) < 0 ? "urgent" : "amber",
      })),

    ...approvals
      .filter((item) => item.status === "Pending")
      .map((item) => ({
        title: item.action,
        detail: "Awaiting your approval",
        href: "/agent" as const,
        tone: "neutral",
      })),
  ].slice(0, 8);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await response.json();

        if (!active) return;

        if (!response.ok || !data.success) {
          setState(() => ({ user: null, business: null }));
        } else {
          setState(() => ({
            user: data.user,
            business: data.business,
          }));
        }
      } catch (error) {
        console.error("Session verification failed:", error);

        if (active) {
          setState(() => ({ user: null, business: null }));
        }
      } finally {
        if (active) setReady(true);
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (!user) nav({ to: "/" });
    else if (!business) nav({ to: "/onboarding" });
  }, [ready, user, business, nav]);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Unable to sign out.");

      setState(() => ({ user: null, business: null }));

      toast.success("Signed out successfully.");
      nav({ to: "/" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Sign out failed."
      );
    } finally {
      setSigningOut(false);
    }
  }

  if (!ready || !user || !business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Preparing your workspace…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      {open && (
        <button
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-[#1D4268] bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR BRAND LOGO */}
        <div className="flex h-[88px] items-center justify-between border-b border-[#1D4268] px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-[#315BFA]/20 text-blue-300 shadow-lg shadow-blue-950/20">
              <ShieldCheck size={24} strokeWidth={2} />
            </div>

            <div>
              <div className="text-lg font-semibold tracking-tight text-white">
                mizan
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#D1DDEC]">
                Business OS
              </div>
            </div>
          </Link>

          <button
            className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* BUSINESS WORKSPACE */}
        <div className="px-4 pt-6">
          <div className="rounded-xl border border-[#1D4268] bg-[#0B2B4D] px-3 py-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D1DDEC]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#29D5A0]" />
              Workspace
            </div>

            <p className="mt-2 truncate text-sm font-semibold text-white">
              {business.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-sidebar-foreground/60">
              {business.location || "Business location not set"}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {(["WORKSPACE", "MANAGE", "BUSINESS"] as const).map((group) => (
            <div key={group}>
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.17em] text-sidebar-foreground/45">
                {group}
              </p>

              <div className="space-y-1">
                {NAV.filter((item) => item.group === group).map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/75 transition-colors hover:bg-white/[0.07] hover:text-white"
                      activeProps={{
                        className:
                          "bg-[#315BFA]/15 text-[#AFC0FF] ring-1 ring-inset ring-[#315BFA]/25",
                      }}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className="shrink-0 opacity-80 group-hover:opacity-100"
                      />

                      <span className="flex-1">{item.label}</span>

                      {item.to === "/tasks" &&
                        tasks.filter((t) => t.status !== "Done").length > 0 && (
                          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px]">
                            {tasks.filter((t) => t.status !== "Done").length}
                          </span>
                        )}

                      {"tag" in item && (
                        <span className="rounded bg-[#315BFA]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#AFC0FF]">
                          {item.tag}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* COMPLIANCE MESSAGE */}
        <div className="mx-4 mb-4 rounded-xl border border-[#1D4268] bg-gradient-to-br from-white/[0.07] to-transparent p-4">
          <div className="mb-2 flex items-center gap-2 text-[#FFB94F]">
            <ShieldCheck size={16} />
            <span className="text-xs font-semibold">
              Compliance, made clear.
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-sidebar-foreground/60">
            Keep your documents, renewals and business tasks in one place.
          </p>
        </div>

        {/* USER PROFILE AND SIGN OUT */}
        <div className="border-t border-[#1D4268] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#343B70] text-xs font-semibold text-white">
              {user.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {user.name}
              </p>

              <p className="truncate text-[10px] text-sidebar-foreground/65">
                {user.email}
              </p>
            </div>

            <button
              title="Sign out"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <LogOut size={16} />
            </button>
          </div>

          {signingOut && (
            <p className="mt-2 text-[10px] text-sidebar-foreground/50">
              Signing out…
            </p>
          )}
        </div>
      </aside>

      {/* MAIN APPLICATION AREA */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-border/80 bg-[#10132D]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-border bg-card p-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
            <div className="relative w-full max-w-[520px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                aria-label="Search Mizan"
                placeholder="Search documents, tasks, deadlines…"
                className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs outline-none transition focus:border-[#315BFA] focus:ring-2 focus:ring-[#315BFA]/10"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative rounded-xl border border-border bg-card p-2.5 text-muted-foreground transition hover:border-[#315BFA] hover:text-foreground"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                aria-haspopup="dialog"
              >
                <Bell size={17} />

                {notifications.length > 0 && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#315BFA]" />
                )}
              </button>

              {notificationsOpen && (
                <div
                  role="dialog"
                  aria-label="Notifications"
                  className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#3A4278] bg-[#20265B] shadow-[0_18px_50px_rgba(41,42,39,0.16)]"
                >
                  <div className="flex items-center justify-between border-b border-[#343B70] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#F3F2FF]">
                        Notifications
                      </p>
                      <p className="text-[11px] text-[#929BC4]">
                        Items that may need your attention
                      </p>
                    </div>

                    <span className="rounded-full bg-[#F0E8D9] px-2 py-1 text-[10px] font-semibold text-[#8C6429]">
                      {notifications.length} items
                    </span>
                  </div>

                  <div className="max-h-[340px] overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell
                          size={20}
                          className="mx-auto mb-2 text-[#A69D8E]"
                        />

                        <p className="text-xs font-medium text-[#D4D7F4]">
                          You're all caught up
                        </p>

                        <p className="mt-1 text-[11px] text-[#929BC4]">
                          New deadlines and approvals will appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map((item, index) => (
                        <Link
                          key={`${item.href}-${item.title}-${index}`}
                          to={item.href}
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-[#F1EDE4]"
                        >
                          <span
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                              item.tone === "urgent"
                                ? "bg-[#B86B55]"
                                : item.tone === "amber"
                                  ? "bg-[#315BFA]"
                                  : "bg-[#8B927B]"
                            }`}
                          />

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-[#E8E9FF]">
                              {item.title}
                            </span>

                            <span className="mt-1 block text-[11px] text-[#929BC4]">
                              {item.detail}
                            </span>
                          </span>

                          <ChevronDown
                            size={13}
                            className="mt-1 -rotate-90 text-[#A69D8E]"
                          />
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="border-t border-[#343B70] px-4 py-2.5">
                    <Link
                      to="/activity"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-semibold text-[#6F8BFF] hover:underline"
                    >
                      Open activity centre
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden h-8 w-px bg-border sm:block" />

            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="text-right">
                <p className="text-xs font-semibold">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {business.authority || "Business owner"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8C6A8] bg-[#343B70] text-xs font-semibold text-[#594A35]">
                {user.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <ChevronDown size={14} className="text-muted-foreground" />
            </div>

            <Link
              to="/profile"
              className="rounded-lg p-2 text-muted-foreground hover:bg-card sm:hidden"
              aria-label="Business settings"
            >
              <Settings2 size={18} />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 xl:px-10">
          <Outlet />
        </main>

        <footer className="px-6 pb-6 text-center text-[10px] text-muted-foreground/70">
          Mizan Business OS <span className="mx-1">·</span> Your business, in balance.
        </footer>
      </div>
    </div>
  );
}
