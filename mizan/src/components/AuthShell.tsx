import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <main className="mizan-auth min-h-screen">
      <section className="auth-brand-panel">
        <div className="auth-brand"><div className="auth-logo"><ShieldCheck size={30} strokeWidth={2.4} /></div><div><div className="text-[25px] font-bold tracking-tight text-white">Mizan</div><div className="text-[11px] font-semibold uppercase tracking-[.24em] text-blue-100/70">Business OS</div></div></div>
        <div className="auth-brand-copy"><span className="auth-eyebrow">YOUR BUSINESS. IN CONTROL.</span><h2>Business compliance,<br/><span>simplified.</span></h2><p>One workspace for your business operations, documents and deadlines.</p></div>
        <div className="auth-orb auth-orb-one" /><div className="auth-orb auth-orb-two" /><div className="auth-orb auth-orb-three" />
        <div className="auth-brand-foot"><span className="h-2 w-2 rounded-full bg-cyan-300"/> A clearer way to run your business</div>
      </section>
      <section className="auth-form-panel"><div className="auth-form-wrap">
        <div className="mb-8 flex items-center gap-3 lg:hidden"><div className="auth-logo !h-12 !w-12"><ShieldCheck size={26}/></div><div><div className="text-xl font-bold text-[#12284B]">Mizan</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">Business OS</div></div></div>
        <h1 className="text-[30px] font-bold tracking-tight text-[#10264A]">{title}</h1><p className="mb-8 mt-2 text-sm text-slate-500">{sub}</p>{children}
      </div></section>
    </main>
  );
}
