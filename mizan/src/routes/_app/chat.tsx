import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, MessageSquare, Trash2, Landmark } from "lucide-react";
import { PageHeader, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore, setState } from "@/lib/store";
import { mockReply } from "@/lib/assistant";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Mizan" },
      { name: "description", content: "Ask about Dubai compliance and your business documents." },
      { property: "og:title", content: "AI Assistant — Mizan" },
      { property: "og:description", content: "Business and compliance answers grounded in your data." },
    ],
  }),
  component: Chat,
});

const SUGGEST = ["When does my trade licence expire?", "Which documents am I missing?", "What deadlines are coming up?"];

function Chat() {
  const s = useStore((x) => x);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [s.chat.length, busy]);
  useEffect(() => { box.current?.focus(); }, [busy]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    const history = [...s.chat, { role: "user" as const, content: text.trim() }];
    setState(() => ({ chat: history }));
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setState((st) => ({ chat: [...history, { role: "assistant", content: mockReply(history, st) }] }));
      setBusy(false);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <PageHeader
        title="AI Assistant"
        sub="Mock mode: connect the backend with a Groq key for real AI answers."
        action={s.chat.length > 0 && <Button variant="outline" size="sm" onClick={() => setState(() => ({ chat: [] }))}><Trash2 className="h-4 w-4" /> Clear</Button>}
      />
      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card p-5">
        {s.chat.length === 0 && (
          <Empty icon={MessageSquare} title="Start a conversation" text="Ask about your licence, documents, tasks or Dubai compliance."
            action={<div className="flex flex-wrap justify-center gap-2">{SUGGEST.map((q) => <Button key={q} size="sm" variant="secondary" onClick={() => send(q)}>{q}</Button>)}</div>} />
        )}
        {s.chat.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && <div className="h-8 w-8 shrink-0 rounded-full bg-accent/10 p-1.5 text-accent"><Landmark className="h-5 w-5" /></div>}
            <div className={`max-w-[75%] whitespace-pre-wrap text-sm leading-relaxed ${m.role === "user" ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground" : ""}`}>
              {m.content.replace(/\*\*/g, "")}
            </div>
          </div>
        ))}
        {busy && <p className="animate-pulse text-xs text-muted-foreground">Thinking…</p>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex gap-2">
        <Textarea ref={box} rows={1} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question…" className="min-h-11 resize-none bg-card"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0 bg-accent text-accent-foreground hover:bg-accent/90" disabled={busy}><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}
