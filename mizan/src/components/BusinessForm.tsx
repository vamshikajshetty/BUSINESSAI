import { useState } from "react";
import { Field } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Business } from "@/lib/store";

const AUTHORITIES = ["Dubai Department of Economy and Tourism (DET)", "Dubai Development Authority (DDA)", "DMCC", "Dubai South", "Other free zone"];
const sel = "h-9 w-full rounded-md border border-input bg-card px-3 text-sm";

export function BusinessForm({ initial, onSave, cta }: { initial?: Business | null; onSave: (b: Business) => void; cta: string }) {
  const [b, setB] = useState<Business>(
    initial ?? { name: "", activity: "", location: "", authority: AUTHORITIES[0]!, licenceNo: "", licenceExpiry: "", employees: 1 },
  );
  const up = (k: keyof Business, v: string | number) => setB({ ...b, [k]: v });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(b); }} className="grid gap-4 sm:grid-cols-2">
      <Field label="Business name"><Input required value={b.name} onChange={(e) => up("name", e.target.value)} /></Field>
      <Field label="Business activity"><Input required value={b.activity} onChange={(e) => up("activity", e.target.value)} placeholder="e.g. IT consultancy" /></Field>
      <Field label="Dubai location"><Input required value={b.location} onChange={(e) => up("location", e.target.value)} placeholder="e.g. Business Bay" /></Field>
      <Field label="Licensing authority">
        <select className={sel} value={b.authority} onChange={(e) => up("authority", e.target.value)}>
          {AUTHORITIES.map((a) => <option key={a}>{a}</option>)}
        </select>
      </Field>
      <Field label="Trade licence number"><Input required value={b.licenceNo} onChange={(e) => up("licenceNo", e.target.value)} /></Field>
      <Field label="Licence expiry date"><Input type="date" required value={b.licenceExpiry} onChange={(e) => up("licenceExpiry", e.target.value)} /></Field>
      <Field label="Employee count"><Input type="number" min={0} required value={b.employees} onChange={(e) => up("employees", Number(e.target.value))} /></Field>
      <div className="flex items-end sm:col-span-2"><Button type="submit">{cta}</Button></div>
    </form>
  );
}
