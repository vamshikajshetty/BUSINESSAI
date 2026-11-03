import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, FileText, Trash2, Eye, FolderLock } from "lucide-react";
import { PageHeader, Panel, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore, setState, uid, log, classify, daysUntil } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({
    meta: [
      { title: "Document Vault — Mizan" },
      { name: "description", content: "Upload, classify and track expiry of your business documents." },
      { property: "og:title", content: "Document Vault — Mizan" },
      { property: "og:description", content: "Secure storage for licences, Ejari, visas and tax documents." },
    ],
  }),
  component: Documents,
});

const CATS = ["All", "Trade Licence", "Ejari", "Visa", "Employee Permit", "Tax", "MOA", "Other"];

function Documents() {
  const docs = useStore((s) => s.docs);
  const ref = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState<string | null>(null);
  // object URLs live for this session only; the backend stores files permanently
  const [urls, setUrls] = useState<Record<string, string>>({});

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      if (f.type !== "application/pdf") { toast.error(`${f.name} is not a PDF`); continue; }
      const id = uid();
      setUrls((u) => ({ ...u, [id]: URL.createObjectURL(f) }));
      const category = classify(f.name);
      setState((s) => ({ docs: [{ id, name: f.name, size: f.size, category, uploadedAt: new Date().toISOString() }, ...s.docs] }));
      log("User", `Uploaded ${f.name} (classified as ${category})`);
    }
  };

  const setExpiry = (id: string, expiry: string) => {
    setState((s) => {
      const d = s.docs.find((x) => x.id === id)!;
      const deadlines = s.deadlines.filter((x) => x.id !== `doc-${id}`);
      if (expiry) deadlines.push({ id: `doc-${id}`, title: `${d.category} expiry (${d.name})`, type: d.category, date: expiry });
      return { docs: s.docs.map((x) => (x.id === id ? { ...x, expiry } : x)), deadlines };
    });
  };

  const shown = docs.filter((d) => filter === "All" || d.category === filter);

  return (
    <>
      <PageHeader title="Document Vault" sub="PDFs are classified by filename here; the backend adds AI text extraction."
        action={<><input ref={ref} type="file" accept="application/pdf" multiple hidden onChange={(e) => onFiles(e.target.files)} /><Button onClick={() => ref.current?.click()}><Upload className="h-4 w-4" /> Upload PDF</Button></>} />
      <div className="mb-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === c ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"}`}>{c}</button>
        ))}
      </div>
      <Panel>
        {shown.length === 0 ? (
          <Empty icon={FolderLock} title="No documents" text="Upload your trade licence, Ejari, MOA and VAT certificate to improve your score." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground"><tr><th className="pb-2">Document</th><th>Category</th><th>Expiry</th><th>Status</th><th /></tr></thead>
              <tbody className="divide-y">
                {shown.map((d) => {
                  const days = d.expiry ? daysUntil(d.expiry) : null;
                  return (
                    <tr key={d.id}>
                      <td className="py-3"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-accent" /><span className="max-w-56 truncate">{d.name}</span></div><p className="text-xs text-muted-foreground">{(d.size / 1024).toFixed(0)} KB</p></td>
                      <td>
                        <select className="rounded-md border bg-card px-2 py-1 text-xs" value={d.category} onChange={(e) => setState((s) => ({ docs: s.docs.map((x) => (x.id === d.id ? { ...x, category: e.target.value } : x)) }))}>
                          {CATS.slice(1).map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td><Input type="date" className="h-8 w-36 text-xs" value={d.expiry ?? ""} onChange={(e) => setExpiry(d.id, e.target.value)} /></td>
                      <td className="text-xs">{days === null ? <span className="text-muted-foreground">No expiry</span> : days < 0 ? <span className="text-destructive">Expired</span> : days <= 30 ? <span className="text-warning">{days}d left</span> : <span className="text-success">Valid</span>}</td>
                      <td className="text-right">
                        <Button size="icon" variant="ghost" disabled={!urls[d.id]} onClick={() => setPreview(urls[d.id] ?? null)} title="Preview"><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => { setState((s) => ({ docs: s.docs.filter((x) => x.id !== d.id), deadlines: s.deadlines.filter((x) => x.id !== `doc-${d.id}`) })); log("User", `Deleted ${d.name}`); }}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6" onClick={() => setPreview(null)}>
          <iframe src={preview} className="h-[85vh] w-full max-w-4xl rounded-lg bg-card" title="Preview" />
        </div>
      )}
    </>
  );
}
