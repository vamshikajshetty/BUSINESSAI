import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold text-sidebar-accent-foreground">
          <ShieldCheck className="h-6 w-6 text-sidebar-primary" /> Mizan
        </div>
        <div>
          <p className="text-3xl font-semibold leading-tight text-sidebar-accent-foreground">
            Run your Dubai business
            <br />
            without missing a deadline.
          </p>
          <p className="mt-4 max-w-md text-sm">
            Licences, Ejari, visas, permits and tax — tracked in one place, with an AI agent that plans the work and asks before acting.
          </p>
        </div>
        <p className="text-xs">Guidance references DET, DLD, DDA and the UAE FTA. Always verify with the authority.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
