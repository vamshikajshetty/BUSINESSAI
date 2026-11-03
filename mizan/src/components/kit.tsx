import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border bg-card p-5 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-sm font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function Empty({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Stat({ icon: Icon, label, value, tone = "accent" }: { icon: LucideIcon; label: string; value: ReactNode; tone?: "accent" | "warning" | "destructive" | "primary" }) {
  const tones = {
    accent: "bg-accent/10 text-accent",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    primary: "bg-primary/10 text-primary",
  };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className={`mb-3 inline-flex rounded-lg p-2 ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
