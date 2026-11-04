import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowRight, ArrowUpRight, Bot, CalendarClock, CheckCircle2,
  CircleAlert, Clock3, FileText, FolderOpen, ListChecks, Plus,
  ShieldCheck, Sparkles, UploadCloud, WandSparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { useStore, setState, daysUntil, REQUIRED_DOCS, type Doc, type Task, type Deadline, type Approval } from "@/lib/store";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [
    { title: "Overview — Mizan" },
    { name: "description", content: "Your business compliance overview, deadlines and work in progress." },
  ] }),
  component: Dashboard,
});

const CHART_COLORS = ["#2875D5", "#16A085", "#E6A23C", "#8956D8", "#D94F64"];
const dateLabel = (value: string) => value ? new Date(`${value.slice(0,10)}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Date not set";

function Dashboard() {
  const { user, business, docs, tasks, deadlines, approvals, activity } = useStore((s) => s);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      const endpoints = [
        { url: "/api/documents", key: "documents", stateKey: "docs" },
        { url: "/api/tasks", key: "tasks", stateKey: "tasks" },
        { url: "/api/deadlines", key: "deadlines", stateKey: "deadlines" },
        { url: "/api/approvals", key: "approvals", stateKey: "approvals" },
      ] as const;
      const results = await Promise.all(endpoints.map(async (item) => {
        try {
          const response = await fetch(item.url, { credentials: "include" });
          const data = await response.json();
          return response.ok && data.success ? { stateKey: item.stateKey, value: data[item.key] } : null;
        } catch { return null; }
      }));
      if (!active) return;
      results.forEach((item) => {
        if (!item) return;
        if (item.stateKey === "documents") setState(() => ({ docs: item.value as Doc[] }));
        if (item.stateKey === "tasks") setState(() => ({ tasks: item.value as Task[] }));
        if (item.stateKey === "deadlines") setState(() => ({ deadlines: item.value as Deadline[] }));
        if (item.stateKey === "approvals") setState(() => ({ approvals: item.value as Approval[] }));
      });
      if (active) setLoading(false);
    }
    hydrate();
    return () => { active = false; };
  }, []);

  const today = new Date();
  const missing = REQUIRED_DOCS.filter((category) => !docs.some((doc) => doc.category === category));
  const upcoming = deadlines.filter((d) => daysUntil(d.date) >= 0 && daysUntil(d.date) <= 90).sort((a,b) => a.date.localeCompare(b.date));
  const overdue = deadlines.filter((d) => daysUntil(d.date) < 0);
  const activeTasks = tasks.filter((t) => t.status !== "Done");
  const completed = tasks.filter((t) => t.status === "Done").length;
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const complianceScore = Math.max(0, Math.round(((REQUIRED_DOCS.length - missing.length) / REQUIRED_DOCS.length) * 100 - overdue.length * 10));
  const expiringDocs = docs.filter((d) => d.expiry && daysUntil(d.expiry) >= 0 && daysUntil(d.expiry) <= 30);
  const expiredDocs = docs.filter((d) => d.expiry && daysUntil(d.expiry) < 0);

  const taskData = [
    { name: "To do", value: tasks.filter((t) => t.status === "To do").length },
    { name: "In progress", value: tasks.filter((t) => t.status === "In progress").length },
    { name: "Done", value: completed },
  ].filter((x) => x.value > 0);
  const docData = [
    { name: "No expiry issue", value: Math.max(0, docs.length - expiringDocs.length - expiredDocs.length) },
    { name: "Expiring soon", value: expiringDocs.length },
    { name: "Expired", value: expiredDocs.length },
    { name: "Missing core docs", value: missing.length },
  ].filter((x) => x.value > 0);
  const deadlineData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return {
        month: month.toLocaleDateString("en", { month: "short" }),
        count: deadlines.filter((d) => {
          const date = new Date(`${d.date}T00:00:00`);
          return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
        }).length,
      };
    });
  }, [deadlines]);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A7440]"><span className="h-px w-6 bg-[#315BFA]"/> BUSINESS OVERVIEW</div>
          <h1 className="text-[27px] font-semibold tracking-tight text-[#F4F7FC] sm:text-[32px]">Good {today.getHours() < 12 ? "morning" : today.getHours() < 17 ? "afternoon" : "evening"}, {firstName}.</h1>
          <p className="mt-1 text-sm text-[#B9CBE0]">A clear view of what needs attention across {business?.name || "your business"}.</p>
        </div>
        <div className="rounded-xl border border-[#3A4278] bg-[#0B2B4D] px-3.5 py-2.5 text-xs font-medium text-[#B9BFDF]">{today.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Compliance score" value={`${complianceScore}%`} note={`${missing.length} core document categories missing`} icon={ShieldCheck} tone="amber" />
        <Metric label="Upcoming deadlines" value={upcoming.length} note="Due within the next 90 days" icon={CalendarClock} tone="sand" />
        <Metric label="Active tasks" value={activeTasks.length} note={`${completed} completed`} icon={ListChecks} tone="sage" />
        <Metric label="Pending approvals" value={pendingApprovals} note={`${expiringDocs.length} documents expiring soon`} icon={CircleAlert} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.9fr)]">
        <Panel className="min-w-0 !rounded-2xl !border-[#3A4278] !bg-[#0B2B4D] !p-5 sm:!p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-sm font-semibold text-[#F4F7FC]">Compliance calendar</p><p className="mt-1 text-xs text-[#929BC4]">Your recorded deadlines over the next six months</p></div>
            <Link to="/calendar" className="inline-flex items-center gap-1 text-xs font-semibold text-[#6F8BFF] hover:underline">Open calendar <ArrowUpRight size={14}/></Link>
          </div>
          {deadlines.length === 0 ? <ChartEmpty text="Add compliance deadlines to see your calendar trend."/> : <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deadlineData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                <defs><linearGradient id="deadlineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#315BFA" stopOpacity={0.25}/><stop offset="100%" stopColor="#315BFA" stopOpacity={0.015}/></linearGradient></defs>
                <CartesianGrid stroke="#E9E2D6" strokeDasharray="3 4" vertical={false}/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#929BC4", fontSize: 11 }}/>
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#929BC4", fontSize: 10 }}/>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #3A4278", background: "#20265B", fontSize: 12 }} />
                <Area type="monotone" dataKey="count" name="Deadlines" stroke="#29D5D0" strokeWidth={2.5} fill="url(#deadlineFill)" isAnimationActive animationBegin={120} animationDuration={1300} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>}
        </Panel>

        <Panel className="min-w-0 !rounded-2xl !border-[#3A4278] !bg-[#0B2B4D] !p-5 sm:!p-6">
          <div className="mb-4"><p className="text-sm font-semibold text-[#F4F7FC]">Document health</p><p className="mt-1 text-xs text-[#929BC4]">Based on uploaded files and expiry dates</p></div>
          {docs.length === 0 && missing.length === 0 ? <ChartEmpty text="Upload documents to see their status here."/> : <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="relative h-[170px] w-[170px] shrink-0">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={docData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={76} paddingAngle={3} stroke="none" isAnimationActive animationBegin={180} animationDuration={1200}>{docData.map((entry, i) => <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #3A4278", background: "#20265B", fontSize: 11 }}/></PieChart></ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-semibold text-[#F4F7FC]">{docs.length}</span><span className="text-[10px] text-[#929BC4]">Documents</span></div>
            </div>
            <div className="w-full space-y-3">
              {docData.map((item, i) => <div key={item.name} className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 text-[#B9CBE0]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}/>{item.name}</span><span className="font-semibold text-[#E8E9FF]">{item.value}</span></div>)}
            </div>
          </div>}
          <Link to="/documents" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#6F8BFF] hover:underline">Manage documents <ArrowRight size={13}/></Link>
        </Panel>
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(280px,0.8fr)]">
        <Panel className="min-w-0 !rounded-2xl !border-[#3A4278] !bg-[#0B2B4D] !p-5">
          <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-[#F4F7FC]">Upcoming deadlines</p><p className="mt-1 text-xs text-[#929BC4]">Next 30 days</p></div><Link to="/calendar" className="text-xs font-semibold text-[#6F8BFF] hover:underline">View all</Link></div>
          {upcoming.length === 0 ? <Empty icon={CalendarClock} title="No upcoming deadlines" text="Your next 90 days are clear, or add a deadline to get started."/> : <ul className="divide-y divide-[#343B70]">{upcoming.slice(0,4).map((d) => <li key={d.id} className="flex items-center gap-3 py-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0E8D9] text-[#6F8BFF]"><CalendarClock size={17}/></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#E8E9FF]">{d.title}</p><p className="mt-0.5 text-[10px] text-[#929BC4]">{d.type} · {dateLabel(d.date)}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${daysUntil(d.date) <= 14 ? "bg-[#4A2C4C] text-[#FF718D]" : "bg-[#292F60] text-[#926B2D]"}`}>{daysUntil(d.date)}d</span></li>)}</ul>}
        </Panel>

        <Panel className="flex h-full min-w-0 flex-col !rounded-2xl !border-[#3A4278] !bg-[#0B2B4D] !p-5">
          <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-[#F4F7FC]">Task progress</p><p className="mt-1 text-xs text-[#929BC4]">{tasks.length} tasks in your workspace</p></div><Link to="/tasks" className="text-xs font-semibold text-[#6F8BFF] hover:underline">View tasks</Link></div>
          {tasks.length === 0 ? <ChartEmpty text="Create a task to start tracking progress."/> : <><div className="min-h-[220px] w-full flex-1"><ResponsiveContainer width="100%" height="100%"><BarChart data={taskData} layout="vertical" margin={{ top: 0, right: 10, left: 2, bottom: 0 }}><XAxis type="number" hide allowDecimals={false}/><YAxis type="category" dataKey="name" width={82} tickLine={false} axisLine={false} tick={{ fill: "#AEB5D5", fontSize: 11 }}/><Tooltip cursor={{ fill: "#303765" }} contentStyle={{ borderRadius: 10, border: "1px solid #3A4278", background: "#20265B", fontSize: 11 }}/><Bar dataKey="value" name="Tasks" radius={[0,5,5,0]} barSize={15} isAnimationActive animationBegin={250} animationDuration={1200} animationEasing="ease-out">{taskData.map((entry) => <Cell key={entry.name} fill={entry.name === "Done" ? "#29D5A0" : entry.name === "In progress" ? "#315BFA" : "#65718D"}/>)}</Bar></BarChart></ResponsiveContainer></div><div className="mt-2 flex items-center justify-between border-t border-[#343B70] pt-3 text-[11px]"><span className="text-[#929BC4]">Completion rate</span><span className="font-semibold text-[#E8E9FF]">{Math.round((completed / tasks.length) * 100)}%</span></div></>}
        </Panel>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#3A4278] bg-gradient-to-br from-[#1B3970] to-[#20265B] p-5">
            <div className="mb-3 flex items-center justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#46508A] text-[#FFB94F]"><Sparkles size={18}/></div><span className="rounded-full border border-[#CDBB9C] px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#FFB94F]">Mizan AI</span></div>
            <h3 className="text-sm font-semibold text-[#F3F6FF]">Your compliance co-pilot.</h3><p className="mt-1 text-xs leading-relaxed text-[#B9C8E8]">Get a clearer picture of what needs attention and what to do next.</p>
            <Link to="/chat" className="mt-4 flex items-center justify-between rounded-xl bg-[#315BFA] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4775ff]">Ask Mizan <ArrowUpRight size={14}/></Link>
          </div>
          <Panel className="!rounded-2xl !border-[#3A4278] !bg-[#0B2B4D] !p-4">
            <p className="mb-3 text-xs font-semibold text-[#E8E9FF]">Quick actions</p>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction to="/documents" icon={UploadCloud} label="Upload document"/>
              <QuickAction to="/tasks" icon={Plus} label="Create task"/>
              <QuickAction to="/calendar" icon={CalendarClock} label="Add deadline"/>
              <QuickAction to="/agent" icon={WandSparkles} label="Run analysis"/>
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="!rounded-2xl !border-[#3A4278] !bg-[#0B2B4D] !p-5">
        <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-[#F4F7FC]">Recent activity</p><p className="mt-1 text-xs text-[#929BC4]">Latest updates across your workspace</p></div><Link to="/activity" className="text-xs font-semibold text-[#6F8BFF] hover:underline">Activity centre</Link></div>
        {activity.length === 0 ? <Empty icon={Clock3} title="No recent activity" text="Your actions and agent updates will appear here."/> : <div className="grid gap-3 md:grid-cols-2">{activity.slice(0,4).map((item) => <div key={item.id} className="flex items-start gap-3 rounded-xl bg-[#252B5A] p-3"><div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#343B70] text-[#FFB94F]">{item.actor === "Agent" ? <Bot size={14}/> : <CheckCircle2 size={14}/>}</div><div className="min-w-0 flex-1"><p className="text-xs leading-relaxed text-[#D4D7F4]">{item.text}</p><p className="mt-1 text-[10px] text-[#929BC4]">{item.actor} · {new Date(item.at).toLocaleString()}</p></div></div>)}</div>}
      </Panel>
      {loading && <p className="text-center text-[10px] text-[#929BC4]">Syncing your latest business data…</p>}
    </div>
  );
}

function Metric({ label, value, note, icon: Icon, tone }: { label: string; value: string | number; note: string; icon: typeof ShieldCheck; tone: "amber" | "sand" | "sage" | "rose" }) {
  const tones = {
    amber: "bg-gradient-to-br from-[#B77A1F] to-[#E6A23C] text-white border-[#F0BC62]/50",
    sand: "bg-gradient-to-br from-[#205DA8] to-[#2875D5] text-white border-[#5B9BE8]/50",
    sage: "bg-gradient-to-br from-[#08765F] to-[#16A085] text-white border-[#45C5A8]/50",
    rose: "bg-gradient-to-br from-[#A83D55] to-[#D94F64] text-white border-[#F17A8C]/50",
  };
  const iconTone = {
    amber: "bg-white/15 text-white",
    sand: "bg-white/15 text-white",
    sage: "bg-white/15 text-white",
    rose: "bg-white/15 text-white",
  };
  return <div className={`dashboard-metric rounded-2xl border p-4 shadow-lg shadow-[#031A31]/20 sm:p-5 ${tones[tone]}`}>
    <div className="mb-4 flex items-center justify-between gap-2"><span className="text-[11px] font-semibold text-white/95">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTone[tone]}`}><Icon size={17}/></span></div>
    <p className="text-[30px] font-bold tracking-tight text-white">{value}</p>
    <p className="mt-1 text-[10px] font-medium text-white/85">{note}</p>
  </div>;
}
function QuickAction({ to, icon: Icon, label }: { to: "/documents" | "/tasks" | "/calendar" | "/agent"; icon: typeof Plus; label: string }) {
  return <Link to={to} className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-[#343B70] bg-[#1A2048] px-2 py-3 text-center text-[10px] font-medium text-[#B9BFDF] transition hover:border-[#C9A56A] hover:bg-[#F1E9DA]"><Icon size={17} className="text-[#6F8BFF]"/>{label}</Link>;
}
function ChartEmpty({ text }: { text: string }) {
  return <div className="flex h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[#3A4278] px-5 text-center"><FolderOpen size={22} className="mb-2 text-[#A49B8B]"/><p className="text-xs text-[#929BC4]">{text}</p></div>;
}
