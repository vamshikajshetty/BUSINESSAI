
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  MessageSquare,
  Trash2,
  Landmark,
} from "lucide-react";
import { PageHeader, Empty } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore, setState } from "@/lib/store";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Mizan" },
      {
        name: "description",
        content: "Ask about Dubai compliance and your business documents.",
      },
      { property: "og:title", content: "AI Assistant — Mizan" },
      {
        property: "og:description",
        content: "Business and compliance answers grounded in your data.",
      },
    ],
  }),
  component: Chat,
});

const SUGGEST = [
  "When does my trade licence expire?",
  "Which documents am I missing?",
  "What deadlines are coming up?",
];

function Chat() {
  const s = useStore((x) => x);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const end = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [s.chat.length, busy]);

  useEffect(() => {
    if (!busy) box.current?.focus();
  }, [busy]);

  const send = async (text: string) => {
    const question = text.trim();

    if (!question || busy) return;

    const history = [
      ...s.chat,
      { role: "user" as const, content: question },
    ];

    setState(() => ({ chat: history }));
    setInput("");
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history.slice(-20),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to get a response from Mizan.",
        );
      }

      setState((st) => ({
        chat: [
          ...st.chat,
          {
            role: "assistant",
            content: data.reply,
          },
        ],
      }));
    } catch (err) {
      console.error("Chat request failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const clearChat = () => {
    if (busy) return;

    setState(() => ({ chat: [] }));
    setError("");
  };

  return (
    <div className="mizan-chat-surface flex-1 space-y-6 overflow-y-auto rounded-xl border p-4 sm:p-6">
      <PageHeader
        title="AI Assistant"
        sub="Your intelligent business and compliance assistant."
        action={
          s.chat.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={busy}
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )
        }
      />

      <div className="flex-1 space-y-6 overflow-y-auto rounded-xl border bg-card p-4 sm:p-6">
        {s.chat.length === 0 && (
          <Empty
            icon={MessageSquare}
            title="Start a conversation"
            text="Ask Mizan about your business, documents, tasks or Dubai compliance."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGEST.map((q) => (
                  <Button
                    key={q}
                    size="sm"
                    variant="secondary"
                    onClick={() => send(q)}
                    disabled={busy}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            }
          />
        )}

        {s.chat.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Landmark className="h-5 w-5" />
              </div>
            )}

            <div
              className={`min-w-0 max-w-[90%] sm:max-w-[82%] ${
                m.role === "user"
                  ? "rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground"
                  : "rounded-xl bg-muted/40 px-4 py-3"
              }`}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {m.content}
                </p>
              ) : (
                <div className="min-w-0 break-words text-sm leading-7 text-foreground [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-semibold [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:pl-1 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-accent/50 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_hr]:my-4 [&_hr]:border-border [&_a]:text-accent [&_a]:underline">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <div className="my-4 w-full overflow-x-auto rounded-lg border">
                          <table className="w-full min-w-[420px] border-collapse text-left text-xs sm:text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-muted">
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th className="border-b px-3 py-2.5 font-semibold">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border-b px-3 py-2.5 align-top">
                          {children}
                        </td>
                      ),
                      code: ({ children }) => (
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="my-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Landmark className="h-5 w-5" />
            </div>
            <span className="animate-pulse">
              Mizan is thinking...
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div ref={end} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <Textarea
          ref={box}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Mizan anything about your business..."
          className="min-h-11 resize-none bg-card"
          disabled={busy}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          className="h-11 w-11 shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={busy || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
